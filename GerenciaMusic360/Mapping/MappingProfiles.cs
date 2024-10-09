using AutoMapper;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;

namespace GerenciaMusic360.Mapping
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Address, PersonAddressModel>()
            .ForMember(d => d.AddressId, opt => opt.MapFrom(s => s.Id))
            .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.AddressStatusRecordId, opt => opt.MapFrom(s => s.StatusRecordId))
            .ForMember(d => d.StatusRecordId, opt => opt.Ignore())
            .ReverseMap();

        }
    }
}
