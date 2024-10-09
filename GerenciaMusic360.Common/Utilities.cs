using GerenciaMusic360.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace GerenciaMusic360.Common
{
    public static class Utilities
    {
        public static IEnumerable<T> MapToList<T>(this DbDataReader dr)
        {
            //ejemplople error
            var result = new List<T>();
            var props = typeof(T).GetRuntimeProperties();
            DataTable dt = new DataTable();
            dt.Load(dr);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                T entity = Activator.CreateInstance<T>();
                foreach (var prop in props)
                {
                    try
                    {
                        if (dt.Columns.Contains(prop.Name))
                        {
                            var val = dt.Rows[i][prop.Name.ToLower()];
                            prop.SetValue(entity, val == DBNull.Value ? null : val);
                        }
                    }
                    catch
                    {
                    }
                }
                result.Add(entity);
            }
            return result;
        }
        public static DateTime? StringToDateTime(string value)
        {
            return string.IsNullOrEmpty(value) ? null : (DateTime?)DateTime.Parse(value);
        }
        public static async Task SendEmail(string host, int port, string username, string password, bool enableSsl, MailMessage message)
        {
            using (var client = new SmtpClient())
            {
                client.Host = host;
                client.Port = port;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(username, password);
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.EnableSsl = enableSsl;
                client.Timeout = 100000;

                ServicePointManager.ServerCertificateValidationCallback = delegate (object s,
                X509Certificate certificate,
                X509Chain chain,
                SslPolicyErrors sslPolicyErrors)
                {
                    return true;
                };

                await client.SendMailAsync(message);
            }
        }
        public static bool SendMail(MailConfig mailConfig, MailMessage message)
        {
            try
            {
                using (SmtpClient smtpClient = new SmtpClient("smtp.office365.com"))
                {
                    smtpClient.Port = 587;//mailConfig.Port;
                    smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                    smtpClient.Credentials = new System.Net.NetworkCredential(mailConfig.UserName, mailConfig.Password);
                    smtpClient.EnableSsl = true;
                    smtpClient.Send(message);
                    return true;
                }
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public static bool IsEmailValid(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}
