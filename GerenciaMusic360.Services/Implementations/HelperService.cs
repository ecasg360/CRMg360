using GerenciaMusic360.Common;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;

namespace GerenciaMusic360.Services.Implementations
{
    public class HelperService : IHelperService
    {
        public string Encrypt(string plainText, string passPhrase)
        {
            var key = Encoding.UTF8.GetBytes(passPhrase);

            using (var aesAlg = Aes.Create())
            {
                using (var encryptor = aesAlg.CreateEncryptor(key, aesAlg.IV))
                {
                    using (var msEncrypt = new MemoryStream())
                    {
                        using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                        using (var swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(plainText);
                        }

                        var iv = aesAlg.IV;

                        var decryptedContent = msEncrypt.ToArray();

                        var result = new byte[iv.Length + decryptedContent.Length];

                        Buffer.BlockCopy(iv, 0, result, 0, iv.Length);
                        Buffer.BlockCopy(decryptedContent, 0, result, iv.Length, decryptedContent.Length);

                        return Convert.ToBase64String(result);
                    }
                }
            }
        }
        public string Decrypt(string cipherText, string passPhrase)
        {
            var fullCipher = Convert.FromBase64String(cipherText);

            var iv = new byte[16];
            var cipher = new byte[fullCipher.Length - iv.Length];

            Buffer.BlockCopy(fullCipher, 0, iv, 0, iv.Length);
            Buffer.BlockCopy(fullCipher, iv.Length, cipher, 0, fullCipher.Length - iv.Length);
            var key = Encoding.UTF8.GetBytes(passPhrase);

            using (var aesAlg = Aes.Create())
            {
                using (var decryptor = aesAlg.CreateDecryptor(key, iv))
                {
                    string result;
                    using (var msDecrypt = new MemoryStream(cipher))
                    {
                        using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {
                            using (var srDecrypt = new StreamReader(csDecrypt))
                            {
                                result = srDecrypt.ReadToEnd();
                            }
                        }
                    }
                    return result;
                }
            }
        }
        public string Base64Encode(string plainText)
        {
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            return Convert.ToBase64String(plainTextBytes);
        }
        public string Base64Decode(string base64Encoded)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64Encoded);
            return Encoding.UTF8.GetString(base64EncodedBytes);
        }
        public DateTime ToDate(string date)
        {
            var dateSplit = date.Split('/');
            return new DateTime(int.Parse(dateSplit[2]), int.Parse(dateSplit[1]), int.Parse(dateSplit[0]));
        }
        public string SaveImage(string image64, string folder, string name, IHostingEnvironment _env)
        {
            var pathProd = Path.Combine("clientapp", "dist");
            var path = Path.Combine("assets", "images", folder);

            if (!Directory.Exists(Path.Combine(_env.WebRootPath, pathProd, path)))
                Directory.CreateDirectory(Path.Combine(_env.WebRootPath, pathProd, path));

            byte[] imageBytes = Convert.FromBase64String(image64);

            var pathFile = Path.Combine(path, name);
            File.WriteAllBytes(Path.Combine(_env.WebRootPath, pathProd, pathFile), imageBytes);

#if DEBUG
            //string debugPath = Path.Combine(_env.ContentRootPath, "ClientApp", "assets", "images");
            //string debugPathFile = Path.Combine(debugPath, folder);
            //if (!Directory.Exists(debugPathFile))
            //    Directory.CreateDirectory(debugPathFile);
            //File.WriteAllBytes(Path.Combine(debugPathFile, name), imageBytes);
#endif
            return pathFile;
        }
        public string SaveFile(string file64, string moduleName, string name, IHostingEnvironment _env)
        {
            var pathProd = Path.Combine("clientapp", "dist");
            var path = Path.Combine("assets", "files", moduleName);

            if (!Directory.Exists(Path.Combine(_env.WebRootPath, pathProd, path)))
                Directory.CreateDirectory(Path.Combine(_env.WebRootPath, pathProd, path));

            byte[] imageBytes = Convert.FromBase64String(file64);

            var pathFile = Path.Combine(path, name);
            File.WriteAllBytes(Path.Combine(_env.WebRootPath, pathProd, pathFile), imageBytes);
#if DEBUG
            //string debugPath = Path.Combine(_env.ContentRootPath, "ClientApp", "assets", "files");
            //string debugPathFile = Path.Combine(debugPath, moduleName);
            //if (!Directory.Exists(debugPathFile))
            //    Directory.CreateDirectory(debugPathFile);
            //File.WriteAllBytes(Path.Combine(debugPathFile, name), imageBytes);
#endif
            return pathFile;
        }
        public bool DeleteFile(string moduleName, string name, IHostingEnvironment _env)
        {
            try
            {
                var path = Path.Combine(_env.WebRootPath, "clientapp", "dist", "assets", "files", moduleName);

                if (Directory.Exists(path))
                {
                    var file = Path.Combine(path, name);

                    if (File.Exists(file))
                    {
                        File.Delete(file);
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        public void SendEmail(MailConfig config, string subject, string body, IEnumerable<string> recipients)
        {
            //Task.Run(async () =>
            //{
            var message = new MailMessage
            {
                From = new MailAddress(config.UserName, config.Display, Encoding.UTF8),
                Subject = subject,
                SubjectEncoding = Encoding.UTF8,
                IsBodyHtml = true,
                Body = body,
                BodyEncoding = Encoding.UTF8,
                DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure
            };

            foreach (var recipient in recipients)
            {
                message.To.Add(recipient);
            }
            Utilities.SendMail(config, message);
            //    await Utilities.SendEmail(
            //       config.Host,
            //       config.Port,
            //       config.UserName,
            //       config.Password,
            //       config.EnableSSL,
            //       message);
            //});
        }
        public string GetMd5Hash(MD5 md5Hash, string input)
        {

            // Convert the input string to a byte array and compute the hash.
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        // Verify a hash against a string.
        public bool VerifyMd5Hash(MD5 md5Hash, string input, string hash)
        {
            // Hash the input.
            string hashOfInput = GetMd5Hash(md5Hash, input);

            // Create a StringComparer an compare the hashes.
            StringComparer comparer = StringComparer.OrdinalIgnoreCase;

            if (0 == comparer.Compare(hashOfInput, hash))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
