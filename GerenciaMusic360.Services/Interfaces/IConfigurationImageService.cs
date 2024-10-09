using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IConfigurationImageService
    {
        IEnumerable<ConfigurationImage> GetAllConfigurationImages();
        IEnumerable<ConfigurationImage> GetAllConfigurationUserImages();
        ConfigurationImage GetConfigurationImage(short id);
        ConfigurationImage GetConfigurationImageByUser(long userId);
        void CreateConfigurationImage(ConfigurationImage configurationImage);
        void UpdateConfigurationImage(ConfigurationImage configurationImage);
        void DeleteConfigurationImage(ConfigurationImage configurationImage);
    }
}
