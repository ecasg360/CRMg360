using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ConfigurationImageService : Repository<ConfigurationImage>, IConfigurationImageService
    {
        public ConfigurationImageService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<ConfigurationImage> GetAllConfigurationImages()
        {
            DbCommand cmd = LoadCmd("GetAllConfigurationImages");
            return ExecuteReader(cmd);
        }

        public IEnumerable<ConfigurationImage> GetAllConfigurationUserImages()
        {
            DbCommand cmd = LoadCmd("GetAllConfigurationUserImages");
            return ExecuteReader(cmd);
        }

        public ConfigurationImage GetConfigurationImage(short id)
        {
            DbCommand cmd = LoadCmd("GetConfigurationImage");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public ConfigurationImage GetConfigurationImageByUser(long userId)
        {
            DbCommand cmd = LoadCmd("GetConfigurationImageByUser");
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd).First();
        }

        public void CreateConfigurationImage(ConfigurationImage configurationImage)
        {
            int imageCount = Count();
            if (imageCount == 0)
                configurationImage.IsDefault = true;
            else
            {
                if (configurationImage.IsDefault)
                {
                    ConfigurationImage lastConfiguration = Find(w => w.IsDefault);
                    Update(lastConfiguration, lastConfiguration.Id);
                }
            }

            Add(configurationImage);
        }
        public void UpdateConfigurationImage(ConfigurationImage configurationImage) =>
        Update(configurationImage, configurationImage.Id);


        public void DeleteConfigurationImage(ConfigurationImage configurationImage)
        {
            Delete(configurationImage);
        }
    }
}
