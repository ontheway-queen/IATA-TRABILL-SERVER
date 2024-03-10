import archiver from 'archiver';
import { Response } from 'express';
import * as fastcsv from 'fast-csv';

export const dbBackup = async (filename: string, data: any, res: Response) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${filename}.csv`
    );

    const csvStream = fastcsv.format({ headers: true });
    csvStream.pipe(res);

    data.forEach((row: any) => {
      csvStream.write(row);
    });

    csvStream.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error during backup',
    });
  }
};

export async function addCSVFileToZip(
  zipStream: archiver.Archiver,
  filename: string,
  data: any
) {
  return new Promise<void>((resolve, reject) => {
    const csvStream = fastcsv.format({ headers: true });

    zipStream.append(csvStream, { name: filename });

    data.forEach((row: any) => {
      csvStream.write(row);
    });

    csvStream.end();

    csvStream.on('end', () => {
      resolve();
    });
  });
}
