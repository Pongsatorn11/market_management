import { Response } from "express";
import { Model, Op } from "sequelize";
import { IStore } from "../interfaces/store.interface";
import { Store } from "../models/store.model";
import { Bill } from "../models/bill.model";
import { IUser, RequestAndUser } from "../interfaces/user.interface";
import { IBill, Status } from "../interfaces/bill.interface";
import { Land } from "../models/land.model";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { User } from "../models/user.model";

interface Item {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

async function generateBillsForAllStores() {
  try {
    const findStores: Model<IStore>[] | null = await Store.findAll();
    if (!findStores) {
      throw new Error("No stores found.");
    }
    const billsPromises = findStores.map(async (store) => {
      try {
        const findLand = await Land.findOne({
          where: { id: store.dataValues.landId },
        });
        let findBeforeBill: Model<IBill> | null;
        try {
          // const currentDate = new Date();
          // const currentMonth = currentDate.getMonth();
          // const currentYear = currentDate.getFullYear();
          findBeforeBill = await Bill.findOne({
            where: {
              storeId: store.dataValues.id,
              // [Op.and]: [
              //   Sequelize.where(
              //     Sequelize.fn("MONTH", Sequelize.col("createdAt")),
              //     currentMonth === 0 ? 12 : currentMonth
              //   ),
              //   Sequelize.where(
              //     Sequelize.fn("YEAR", Sequelize.col("createdAt")),
              //     currentMonth === 0 ? currentYear - 1 : currentYear
              //   ),
              // ],
            },
            order: [["createdAt", "DESC"]],
            limit: 1,
          });
          if (
            findBeforeBill?.dataValues.electricityUnit === 0 ||
            findBeforeBill?.dataValues.waterUnit === 0
          ) {
            await findBeforeBill.update({
              electricityUnit: findBeforeBill.dataValues.electricityUnitBefore,
              waterUnit: findBeforeBill.dataValues.waterUnitBefore,
            });
          }
        } catch (error) {
          findBeforeBill = null;
        }
        try {
          const bill = await Bill.create({
            landId: store.dataValues.landId,
            storeId: store.dataValues.id,
            rentPrice: store.dataValues.rentPrice,
            waterUnitBefore: findBeforeBill
              ? findBeforeBill.dataValues.waterUnit
              : 0,
            electricityUnitBefore: findBeforeBill
              ? findBeforeBill.dataValues.electricityUnit
              : 0,
            WaterPriceUnit: findLand!.dataValues.WaterPriceUnit,
            electricityPriceUnit: findLand!.dataValues.electricityPriceUnit,
          });
          if (!bill) {
            throw new Error("Error creating bill.");
          }
        } catch (error: any) {
          throw new Error(
            `Error creating bill for store ${store.dataValues.id}: ${error.message}`
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
    await Promise.all(billsPromises);
    console.log("Bills generated successfully for all stores.");
  } catch (error) {
    console.error("Error generating bills:", error);
  }
}

const getBillsByOwner = async (req: RequestAndUser, res: Response) => {
  try {
    const { date } = req.query;

    const findLengthStores: number = await Store.count({
      where: { landId: req.user!.landId },
    });

    const findBillsByLand: Model<IBill>[] | null = await Bill.findAll({
      where: {
        landId: req.user!.landId,
        createdAt: date ? date : { [Op.ne]: null },
        // [Op.and]: [
        //   Sequelize.where(
        //     Sequelize.fn("MONTH", Sequelize.col("createdAt")),
        //     Number(month)
        //   ),
        //   Sequelize.where(
        //     Sequelize.fn("YEAR", Sequelize.col("createdAt")),
        //     Number(year)
        //   ),
        // ],
      },
      order: [["createdAt", "DESC"]],
      limit: findLengthStores,
    });

    const storesAndBills = await Promise.all(
      findBillsByLand.map(async (bill) => {
        const store = await Store.findOne({
          where: { id: bill.dataValues.storeId },
        });
        return {
          store: store?.dataValues,
          bill: bill?.dataValues,
        };
      })
    );

    return res
      .status(200)
      .json(
        storesAndBills.sort((a, b) => a.store.area.localeCompare(b.store.area))
      );
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getBills = async (req: RequestAndUser, res: Response) => {
  try {
    const user = req.user!;
    const { perPage = 10, page = 1, status } = req.query;
    const offset = (Number(page) - 1) * Number(perPage);
    // const { month, year } = req.query;
    const findBillsByLand: Model<IBill>[] | null = await Bill.findAll({
      where: {
        storeId: user.storeId,
        status: status ? status : { [Op.ne]: null },
        InvoicePdfPath: {
          [Op.ne]: "",
        },
        // [Op.and]: [
        //   Sequelize.where(
        //     Sequelize.fn("MONTH", Sequelize.col("createdAt")),
        //     Number(month)
        //   ),
        //   Sequelize.where(
        //     Sequelize.fn("YEAR", Sequelize.col("createdAt")),
        //     Number(year)
        //   ),
        // ],
      },
      limit: Number(perPage),
      offset: offset,
    });
    return res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      total: findBillsByLand.length,
      items: findBillsByLand,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getBill = async (req: RequestAndUser, res: Response) => {
  try {
    const { id } = req.params;
    const findBill: Model<IBill> | null = await Bill.findOne({
      where: { id: id },
    });
    if (!findBill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    return res.status(200).json(findBill);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateWaterElectricityUnitBill = async (
  req: RequestAndUser,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { waterUnit, electricityUnit } = req.body;

    const findBill: Model<IBill> | null = await Bill.findOne({
      where: { id: id },
    });
    if (!findBill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    if (
      waterUnit < findBill.dataValues.waterUnitBefore ||
      electricityUnit < findBill.dataValues.electricityUnitBefore
    ) {
      return res.status(400).json({
        message: "waterUnit and electricityUnit must be greater than before",
      });
    }

    const waterBill =
      findBill.dataValues.WaterPriceUnit *
      (waterUnit - findBill.dataValues.waterUnitBefore);
    const electricityBill =
      findBill.dataValues.electricityPriceUnit *
      (electricityUnit - findBill.dataValues.electricityUnitBefore);
    const total = findBill.dataValues.rentPrice + waterBill + electricityBill;

    const billUpdateData = {
      waterUnit,
      electricityUnit,
      waterBill,
      electricityBill,
      total,
    };

    const findStore: Model<IStore> | null = await Store.findOne({
      where: { id: findBill.dataValues.storeId },
    });
    if (!findStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    const findUser: Model<IUser> | null = await User.findOne({
      where: { id: findStore.dataValues.userId },
    });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const invoiceDate = new Date();

    const fontPath = path.resolve("./src/assets/front/", "THSarabun.ttf");
    const doc = new PDFDocument({ margin: 20, font: fontPath });
    const fileName = `${
      Date.now() + "-" + Math.round(Math.random() * 1e9)
    }.pdf`;

    // const filePath = path.resolve("./uploads/", "test.pdf");
    const filePath = path.resolve("./uploads/", fileName);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const formattedInvoiceDate = invoiceDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc.fillColor("black");
    doc.fontSize(26).text("ใบแจ้งหนี้/Invoice", { align: "center" });
    const logoPath = path.resolve("./src/assets/image/", "MMGs.png");
    doc.image(logoPath, 500, 10, { width: 100, height: 100 });

    doc.fontSize(20).text("MMGs Co., Ltd.", 15, 60);
    doc.text("123 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400", 15, 80);
    doc.text("โทร 086-608-9385 อีเมล MMGs@gmail.com", 15, 100);
    doc.text(`เลขประจำตัวผู้เสียภาษี 1234567890123`, 15, 120);

    doc.rect(28, 160, 560, 260).stroke();
    doc.text("รหัสผู้เช่า Code", 33, 170);
    doc.text(findUser.dataValues.id.toString(), 130, 170);
    doc.text("ชื่อผู้เช่า Name", 33, 190);
    doc.text(
      findUser.dataValues.firstName + " " + findUser.dataValues.lastName,
      130,
      190
    );
    doc.text("ที่อยู่ Address", 33, 210);
    doc.text(findUser.dataValues.address, 130, 210);
    doc.text("โซน Area", 33, 230);
    doc.text(findStore.dataValues.area.toLocaleUpperCase(), 130, 230);
    doc.text(`วันที่ ${formattedInvoiceDate}`, 440, 170);
    doc.text(`เวลา ${invoiceDate.toLocaleTimeString("th-TH")}`, 440, 190);
    const startX = 28;
    const startY = 270;
    const cellPadding = 10;
    const colWidth = 80;
    const rowHeight = 30;

    const data = [
      [
        "ลำดับ",
        "รายการ",
        "เลขครั้งก่อน",
        "เลขครั้งหลัง",
        "หน่วยที่ใช้",
        "หน่วยละ",
        "รวม",
      ],
      [
        "1",
        "ค่าเช่า",
        "-",
        "-",
        "-",
        "-",
        findBill.dataValues.rentPrice.toLocaleString(),
      ],
      [
        "2",
        "ค่าน้ำ",
        findBill.dataValues.waterUnitBefore.toLocaleString(),
        waterUnit.toLocaleString(),
        (
          waterUnit - findBill.dataValues.waterUnitBefore
        ).toLocaleString(),
        findBill.dataValues.WaterPriceUnit.toLocaleString(),
        waterBill.toLocaleString(),
      ],
      [
        "3",
        "ค่าไฟ",
        findBill.dataValues.electricityUnitBefore.toLocaleString(),
        electricityUnit.toLocaleString(),
        (
          electricityUnit -
          findBill.dataValues.electricityUnitBefore
        ).toLocaleString(),
        findBill.dataValues.electricityPriceUnit.toLocaleString(),
        electricityBill.toLocaleString(),
      ],
    ];

    function drawTable(data: string[][], startX: number, startY: number) {
      let y = startY;

      data.forEach((row) => {
        let x = startX;
        row.forEach((cell) => {
          doc.rect(x, y, colWidth, rowHeight).stroke();
          doc.text(cell, x + cellPadding, y + cellPadding);
          x += colWidth;
        });
        y += rowHeight;
      });
    }

    doc.fontSize(20);
    drawTable([data[0]], startX, startY);

    doc.fontSize(18);
    drawTable(data.slice(1), startX, startY + rowHeight);

    doc.fontSize(20).text("รวมทั้งสิ้น", 250, 395);

    doc.text(total.toLocaleString(), 520, 395);
    doc.rect(508, 390, 80, 30).stroke();
    doc.end();

    writeStream.on("finish", async () => {
      try {
        await findBill.update({
          ...billUpdateData,
          InvoicePdfPath: `uploads\\${fileName}`,
        });
        return res.status(200).json({ message: "Update success" });
      } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const confirmBill = async (req: RequestAndUser, res: Response) => {
  try {
    const { id } = req.params;

    const findBill: Model<IBill> | null = await Bill.findOne({
      where: { id: id },
    });
    if (!findBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const findStore: Model<IStore> | null = await Store.findOne({
      where: { id: findBill.dataValues.storeId },
    });
    if (!findStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    const findUser: Model<IUser> | null = await User.findOne({
      where: { id: findStore.dataValues.userId },
    });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const receiptDate = new Date();

    const fontPath = path.resolve("./src/assets/front/", "THSarabun.ttf");
    const doc = new PDFDocument({ margin: 20, font: fontPath });
    const fileName = `${
      Date.now() + "-" + Math.round(Math.random() * 1e9)
    }.pdf`;

    // const filePath = path.resolve("./uploads/", "test.pdf");
    const filePath = path.resolve("./uploads/", fileName);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const formattedInvoiceDate = receiptDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc.fillColor("black");
    doc.fontSize(26).text("ใบเสร็จ/Receipt", { align: "center" });
    const logoPath = path.resolve("./src/assets/image/", "MMGs.png");
    doc.image(logoPath, 500, 10, { width: 100, height: 100 });

    doc.fontSize(20).text("MMGs Co., Ltd.", 15, 60);
    doc.text("123 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400", 15, 80);
    doc.text("โทร 086-608-9385 อีเมล MMGs@gmail.com", 15, 100);
    doc.text(`เลขประจำตัวผู้เสียภาษี 1234567890123`, 15, 120);

    doc.rect(28, 160, 560, 260).stroke();
    doc.text("รหัสผู้เช่า Code", 33, 170);
    doc.text(findUser.dataValues.id.toString(), 130, 170);
    doc.text("ชื่อผู้เช่า Name", 33, 190);
    doc.text(
      findUser.dataValues.firstName + " " + findUser.dataValues.lastName,
      130,
      190
    );
    doc.text("ที่อยู่ Address", 33, 210);
    doc.text(findUser.dataValues.address, 130, 210);
    doc.text("โซน Area", 33, 230);
    doc.text(findStore.dataValues.area.toLocaleUpperCase(), 130, 230);
    doc.text(`วันที่ ${formattedInvoiceDate}`, 440, 170);
    doc.text(`เวลา ${receiptDate.toLocaleTimeString("th-TH")}`, 440, 190);
    const startX = 28;
    const startY = 270;
    const cellPadding = 10;
    const colWidth = 80;
    const rowHeight = 30;

    const data = [
      [
        "ลำดับ",
        "รายการ",
        "เลขครั้งก่อน",
        "เลขครั้งหลัง",
        "หน่วยที่ใช้",
        "หน่วยละ",
        "รวม",
      ],
      [
        "1",
        "ค่าเช่า",
        "-",
        "-",
        "-",
        "-",
        findBill.dataValues.rentPrice.toLocaleString(),
      ],
      [
        "2",
        "ค่าน้ำ",
        findBill.dataValues.waterUnitBefore.toLocaleString(),
        findBill.dataValues.waterUnit.toLocaleString(),
        (
          findBill.dataValues.waterUnit - findBill.dataValues.waterUnitBefore
        ).toLocaleString(),
        findBill.dataValues.WaterPriceUnit.toLocaleString(),
        findBill.dataValues.waterBill.toLocaleString(),
      ],
      [
        "3",
        "ค่าไฟ",
        findBill.dataValues.electricityUnitBefore.toLocaleString(),
        findBill.dataValues.electricityUnit.toLocaleString(),
        (
          findBill.dataValues.electricityUnit -
          findBill.dataValues.electricityUnitBefore
        ).toLocaleString(),
        findBill.dataValues.electricityPriceUnit.toLocaleString(),
        findBill.dataValues.electricityBill.toLocaleString(),
      ],
    ];

    function drawTable(data: string[][], startX: number, startY: number) {
      let y = startY;

      data.forEach((row) => {
        let x = startX;
        row.forEach((cell) => {
          doc.rect(x, y, colWidth, rowHeight).stroke();
          doc.text(cell, x + cellPadding, y + cellPadding);
          x += colWidth;
        });
        y += rowHeight;
      });
    }

    doc.fontSize(20);
    drawTable([data[0]], startX, startY);

    doc.fontSize(18);
    drawTable(data.slice(1), startX, startY + rowHeight);

    doc.fontSize(20).text("รวมทั้งสิ้น", 250, 395);

    doc.text(findBill.dataValues.total.toLocaleString(), 520, 395);
    doc.rect(508, 390, 80, 30).stroke();

    doc.text("ชำระเมื่อ", 430, 430);
    doc.text(`${formattedInvoiceDate}`, 500, 430);

    doc.text("ลงชื่อผู้รับเงิน", 60, 540);
    doc.text("(............................................)", 28, 570);
    doc.text("เจ้าของกิจการ", 60, 590);

    doc.text("ลงชื่อผู้รับเงิน", 470, 540);
    doc.text("(............................................)", 430, 570);
    doc.text("เจ้าของตลาด", 470, 590);

    doc.end();

    writeStream.on("finish", async () => {
      try {
        await findBill.update({
          status: Status.SUCCESS,
          ReceiptPdfPath: `uploads\\${fileName}`,
        });
        return res.status(200).json({ message: "Confirm bill success" });
      } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getDateTimeBills = async (req: RequestAndUser, res: Response) => {
  try{
    const {landId} = req.user!;
    const findDateTimeBills: Model<IBill>[] | null = await Bill.findAll({
      where: {
        landId: landId,
      },
      order: [["createdAt", "DESC"]],
    });
    const uniqueDate = findDateTimeBills.reduce((acc: string[], bill) => {
      if (!acc.includes(new Date(bill.dataValues.createdAt).toISOString())) {
        acc.push(new Date(bill.dataValues.createdAt).toISOString());
      }
      return acc;
    },[])
    return res.status(200).json(uniqueDate);
  }catch(error){
    return res.status(500).json({ message: "Something went wrong" });
  }
}

const getDateTimeBillsByStore = async (req: RequestAndUser, res: Response) => {
  try{
    const {storeId} = req.user!;
    const { status }= req.query;
    const findDateTimeBills: Model<IBill>[] | null = await Bill.findAll({
      where: {
        storeId: storeId,
        status: status ? status : { [Op.ne]: null },
        InvoicePdfPath: {
          [Op.ne]: "",
        },
      },
      order: [["createdAt", "DESC"]],
    });
    const uniqueDate = findDateTimeBills.reduce((acc: {date: string,id: number}[], bill) => {
        acc.push({
          date: new Date(bill.dataValues.createdAt).toISOString(),
          id: bill.dataValues.id
        });
      return acc;
    },[])
    return res.status(200).json(uniqueDate);
  }catch(error){
    return res.status(500).json({ message: "Something went wrong" });
  }
}


export default {
  generateBillsForAllStores,
  getBillsByOwner,
  getBills,
  getBill,
  updateWaterElectricityUnitBill,
  confirmBill,
  getDateTimeBills,
  getDateTimeBillsByStore
};
