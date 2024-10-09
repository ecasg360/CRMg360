using GerenciaMusic360.Entities.Models;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IHelperService
    {
        string Encrypt(string plainText, string passPhrase);
        string Decrypt(string cipherText, string passPhrase);
        string Base64Encode(string plainText);
        string Base64Decode(string base64Encoded);
        DateTime ToDate(string date);
        string SaveImage(string image64, string folder, string name, IHostingEnvironment _env);
        string SaveFile(string file64, string moduleName, string name, IHostingEnvironment _env);
        bool DeleteFile(string moduleName, string name, IHostingEnvironment _env);
        void SendEmail(MailConfig config, string subject, string body, IEnumerable<string> recipients);
        string GetMd5Hash(MD5 md5Hash, string input);
        bool VerifyMd5Hash(MD5 md5Hash, string input, string hash);
    }
}
