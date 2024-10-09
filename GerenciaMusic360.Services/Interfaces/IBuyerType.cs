using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IBuyerTypeService
    {
        IEnumerable<BuyerType> GetList();
        void Create(BuyerType projectBuyer);
        //void Create(List<BuyerType> projectBuyers);
        void Delete(BuyerType projectBuyer);
        //void Delete(IEnumerable<BuyerType> projectBuyers);
    }
}
