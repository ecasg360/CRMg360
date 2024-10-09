using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _addressService;

        public AddressController(
           IAddressService addressService)
        {
            _addressService = addressService;
        }

        [Route("api/Addresses")]
        [HttpGet]
        public MethodResponse<List<Address>> Get(int personId)
        {
            var result = new MethodResponse<List<Address>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _addressService.GetAddressesByPerson(personId)
                .ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Address")]
        [HttpGet]
        public MethodResponse<Address> Get(int personId, int typeId)
        {
            var result = new MethodResponse<Address> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _addressService.GetAddressesByType(personId, typeId);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/AddressById")]
        [HttpGet]
        public MethodResponse<Address> GetBytId(int id)
        {
            var result = new MethodResponse<Address> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _addressService.GetAddress(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Address")]
        [HttpPost]
        public MethodResponse<Address> Post([FromBody] Address model)
        {
            var result = new MethodResponse<Address> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;

                result.Result = _addressService.CreateAddress(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Addresses")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<Address> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (Address address in model)
                {
                    address.StatusRecordId = 1;
                    address.Created = DateTime.Now;
                    address.Creator = userId;
                }
                _addressService.CreateAddresses(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Address")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Address model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                Address address = _addressService.GetAddress(model.Id);
                address.CountryId = model.CountryId;
                address.StateId = model.StateId;
                address.CityId = model.CityId;
                address.AddressTypeId = model.AddressTypeId;
                address.Municipality = model.Municipality;
                address.Neighborhood = model.Neighborhood;
                address.Street = model.Street;
                address.ExteriorNumber = model.ExteriorNumber;
                address.InteriorNumber = model.InteriorNumber;
                address.PostalCode = model.PostalCode;
                address.Reference = model.Reference;
                address.Latitude = model.Longitude;
                address.ArrayGoogle = model.ArrayGoogle;
                address.Modified = DateTime.Now;
                address.Modifier = userId;
                address.AddressLine1 = model.AddressLine1;
                address.AddressLine2 = model.AddressLine2;
                address.State = model.State;

                _addressService.UpdateAddress(address);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Addresses")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<Address> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (Address addressModel in model)
                {
                    Address address = _addressService.GetAddress(addressModel.Id);
                    address.CountryId = addressModel.CountryId;
                    address.StateId = addressModel.StateId;
                    address.CityId = addressModel.CityId;
                    address.AddressTypeId = addressModel.AddressTypeId;
                    address.Municipality = addressModel.Municipality;
                    address.Neighborhood = addressModel.Neighborhood;
                    address.Street = addressModel.Street;
                    address.ExteriorNumber = addressModel.ExteriorNumber;
                    address.InteriorNumber = addressModel.InteriorNumber;
                    address.PostalCode = addressModel.PostalCode;
                    address.Reference = addressModel.Reference;
                    address.Latitude = addressModel.Longitude;
                    address.ArrayGoogle = addressModel.ArrayGoogle;
                    address.Modified = DateTime.Now;
                    address.Modifier = userId;

                    _addressService.UpdateAddress(address);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/AddressStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Address address = _addressService.GetAddress(Convert.ToInt32(model.Id));

                address.StatusRecordId = model.Status;
                address.Modified = DateTime.Now;
                address.Modifier = userId;

                _addressService.UpdateAddress(address);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/AddressesStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<StatusUpdateModel> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                foreach (StatusUpdateModel statusModel in model)
                {
                    Address address = _addressService.GetAddress(Convert.ToInt32(statusModel.Id));

                    address.StatusRecordId = statusModel.Status;
                    address.Modified = DateTime.Now;
                    address.Modifier = userId;

                    _addressService.UpdateAddress(address);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Address")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId, int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Address address = _addressService.GetAddress(Convert.ToInt32(id));

                address.StatusRecordId = 3;
                address.Modified = DateTime.Now;
                address.Modifier = userId;

                _addressService.UpdateAddress(address);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Addresses")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int personId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                List<Address> addresses = _addressService.
                    GetAddressesByPerson(Convert.ToInt32(personId))
                    .ToList();

                foreach (Address address in addresses)
                {
                    address.StatusRecordId = 3;
                    address.Modified = DateTime.Now;
                    address.Modifier = userId;

                    _addressService.UpdateAddress(address);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
    }
}