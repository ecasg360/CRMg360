
using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class AssociationService : Repository<Association>, IAssociationService
    {
        public AssociationService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Association> GetAllAssociations() =>
        FindAll(w => w.StatusRecordId != 3);

        public Association GetAssociation(int id) => Find(f => f.Id == id);

        public Association SaveAssociation(Association entity) => Add(entity);

        public Association UpdateAssociation(Association entity) => Update(entity, entity.Id);
    }
}
