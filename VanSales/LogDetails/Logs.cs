using System.IO;
using System;

namespace VanSale.LogDetails
{
    public class Logs
    {
        private static string CreateDirectory(string logpath)
        {
            try
            {
                var rootFolder = logpath;
                if (!Directory.Exists(rootFolder))
                    Directory.CreateDirectory(rootFolder);

                if (!Directory.Exists(rootFolder + "\\" + DateTime.Now.Year))
                    Directory.CreateDirectory(rootFolder + "\\" + DateTime.Now.Year);

                if (!Directory.Exists(rootFolder + "\\" + DateTime.Now.Year + "\\" + DateTime.Now.Month))
                    Directory.CreateDirectory(rootFolder + "\\" + DateTime.Now.Year + "\\" + DateTime.Now.Month);

                if (!Directory.Exists(rootFolder + "\\" + DateTime.Now.Year + "\\" + DateTime.Now.Month + "\\" + DateTime.Now.Day))
                    Directory.CreateDirectory(rootFolder + "\\" + DateTime.Now.Year + "\\" + DateTime.Now.Month + "\\" + DateTime.Now.Day);


                return rootFolder + "\\" + DateTime.Now.Year + "\\" + DateTime.Now.Month + "\\" + DateTime.Now.Day;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return string.Empty;
            }
        }
        public void CreateLog(string logMessage, string logpath)
        {
            
            try
            {

                logpath = CreateDirectory(logpath) + "\\" + "Sang_Log_" + DateTime.Now.Date.ToString("yyyyMMdd") + ".log";

                FileInfo fi = new FileInfo(logpath + ".txt");
                using (StreamWriter sw = fi.AppendText())
                {
                    sw.Write("\r\n\n---------------------------------------------------------------\n\nLog Entry : " + DateTime.Now.ToString() + " - \r\n-------------------------------------------------------------\n" + logMessage);
                }
            }
            catch (Exception ex)
            {
                ex.ToString();
               
            }
        }
    }
}
