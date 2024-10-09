using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Globalization;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingService : Repository<Marketing>, IMarketingService
    {
        public MarketingService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        IEnumerable<Marketing> IMarketingService.GetAll()
        {
            IEnumerable<Marketing> marketings = GetAll()
                .OrderByDescending(o => o.Id);

            foreach (Marketing marketing in marketings)
            {
                if (marketing.StartDate != null)
                    marketing.StartDateString =
                       marketing.StartDate.Value.ToString("M/d/yyyy", CultureInfo.InvariantCulture);

                if (marketing.EndDate != null)
                    marketing.EndDateString =
                        marketing.EndDate.Value.ToString("M/d/yyyy", CultureInfo.InvariantCulture);
            }
            return marketings;
        }

        public IEnumerable<Marketing> GetByLabel()
        {
            DbCommand cmd = LoadCmd("GetMarketingByLabel");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Marketing> GetByEvent()
        {
            DbCommand cmd = LoadCmd("GetMarketingByEvent");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Marketing> GetByAgency()
        {
            DbCommand cmd = LoadCmd("GetMarketingByAgency");
            return ExecuteReader(cmd);
        }

        Marketing IMarketingService.Get(int id)
        {
            DbCommand cmd = LoadCmd("GetMarketing");
            cmd = AddParameter(cmd, "Id", id);
            Marketing marketing = ExecuteReader(cmd).First();

            if (marketing.StartDate != null)
                marketing.StartDateString =
                   marketing.StartDate.Value.ToString("M/d/yyyy", CultureInfo.InvariantCulture);

            if (marketing.EndDate != null)
                marketing.EndDateString =
                    marketing.EndDate.Value.ToString("M/d/yyyy", CultureInfo.InvariantCulture);

            return marketing;
        }

        Marketing IMarketingService.Create(Marketing marketing) =>
        Add(marketing);

        void IMarketingService.Update(Marketing marketing) =>
        Update(marketing, marketing.Id);

        void IMarketingService.Delete(Marketing marketing) =>
        Delete(marketing);

        IEnumerable<Marketing> IMarketingService.GetByProject(int projectId)
        {
            return FindAll(f => f.ProjectId == projectId);
        }
    }
}
