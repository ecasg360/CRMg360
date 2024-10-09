using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class StartCenterController : ControllerBase
    {
        private readonly IStartCenterOneService _startCenterOneService;
        private readonly IStartCenterTwoService _startCenterTwoService;
        private readonly IStartCenterThreeService _startCenterThreeService;

        public StartCenterController(
            IStartCenterOneService startCenterOneService,
            IStartCenterTwoService startCenterTwoService,
            IStartCenterThreeService startCenterThreeService)
        {
            _startCenterOneService = startCenterOneService;
            _startCenterTwoService = startCenterTwoService;
            _startCenterThreeService = startCenterThreeService;
        }


        [Route("api/StartCenterOne")]
        [HttpGet]
        public MethodResponse<List<StartCenterOne>> Get(int type, int year)
        {
            var result = new MethodResponse<List<StartCenterOne>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _startCenterOneService.GetStartCenterOne(type, year)
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

        [Route("api/StartCenterTwo")]
        [HttpGet]
        public MethodResponse<List<StartCenterTwo>> GetTwo(int type, int year)
        {
            var result = new MethodResponse<List<StartCenterTwo>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _startCenterTwoService.GetStartCenterTwo(type, year)
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

        [Route("api/StartCenterThree")]
        [HttpGet]
        public MethodResponse<List<StartCenterThree>> Get(int type)
        {
            var result = new MethodResponse<List<StartCenterThree>> { Code = 100, Message = "Success", Result = null };
            var result2 = new MethodResponse<List<StartCenterThree>> { Code = 100, Message = "Success", Result = null };
            try
            {
                if (type == 1)
                {
                    var allProjects = _startCenterThreeService.GetStartCenterThree(type)
                    .ToList();
                    var lstSingleRelease = allProjects.Where(item => item.Type == "Single Release").ToList();
                    var lstAlbumRelease = allProjects.Where(item => item.Type == "Album Release").ToList();
                    var lstArtistSale = allProjects.Where(item => item.Type == "Artist Sale").ToList();
                    var lstEvent = allProjects.Where(item => item.Type == "Event").ToList();
                    #region primera fila
                    if (lstAlbumRelease.Count() == 0)
                    {
                        result.Result = lstSingleRelease.Take(4).ToList();
                    }
                    if (lstSingleRelease.Count() == 0)
                    {
                        result.Result = lstAlbumRelease.Take(4).ToList();
                    }
                    if (lstAlbumRelease.Count() == 1)
                    {
                        result.Result = lstAlbumRelease.Take(1).ToList();
                        result.Result.AddRange(lstSingleRelease.Take(3).ToList());
                    }
                    if (lstSingleRelease.Count() == 1)
                    {
                        result.Result = lstAlbumRelease.Take(3).ToList();
                        result.Result.AddRange(lstSingleRelease.Take(1).ToList());
                    }
                    if (lstAlbumRelease.Count() == 2)
                    {
                        result.Result = lstAlbumRelease.Take(2).ToList();
                        result.Result.AddRange(lstSingleRelease.Take(2).ToList());
                    }
                    if (lstSingleRelease.Count() == 2)
                    {
                        result.Result = lstAlbumRelease.Take(2).ToList();
                        result.Result.AddRange(lstSingleRelease.Take(2).ToList());
                    }
                    if (lstAlbumRelease.Count() == 3)
                    {
                        result.Result = lstAlbumRelease.Take(3).ToList();
                        result.Result.AddRange(lstSingleRelease.Take(1).ToList());
                    }
                    if (lstSingleRelease.Count() == 3)
                    {
                        result.Result = lstAlbumRelease.Take(1).ToList();
                        result.Result.AddRange(lstSingleRelease.Take(3).ToList());
                    }
                    if (lstAlbumRelease.Count() > 3 && lstSingleRelease.Count() > 3)
                    {
                        result.Result = lstAlbumRelease.Take(2).ToList();
                        result.Result.AddRange(lstSingleRelease.Take(2).ToList());
                    }
                    #endregion
                    #region segunda fila
                    if (lstArtistSale.Count() == 0)
                    {
                        result2.Result = lstEvent.Take(4).ToList();
                    }
                    if (lstEvent.Count() == 0)
                    {
                        result2.Result = lstArtistSale.Take(4).ToList();
                    }
                    if (lstArtistSale.Count() == 1)
                    {
                        result2.Result = lstArtistSale.Take(1).ToList();
                        result2.Result.AddRange(lstEvent.Take(3).ToList());
                    }
                    if (lstEvent.Count() == 1)
                    {
                        result2.Result = lstArtistSale.Take(3).ToList();
                        result2.Result.AddRange(lstEvent.Take(1).ToList());
                    }
                    if (lstArtistSale.Count() == 2)
                    {
                        result2.Result = lstArtistSale.Take(2).ToList();
                        result2.Result.AddRange(lstEvent.Take(2).ToList());
                    }
                    if (lstEvent.Count() == 2)
                    {
                        result2.Result = lstAlbumRelease.Take(2).ToList();
                        result2.Result.AddRange(lstEvent.Take(2).ToList());
                    }
                    if (lstArtistSale.Count() == 3)
                    {
                        result2.Result = lstArtistSale.Take(3).ToList();
                        result2.Result.AddRange(lstEvent.Take(1).ToList());
                    }
                    if (lstEvent.Count() == 3)
                    {
                        result2.Result = lstAlbumRelease.Take(1).ToList();
                        result2.Result.AddRange(lstEvent.Take(3).ToList());
                    }
                    if (lstArtistSale.Count() > 3 && lstEvent.Count() > 3)
                    {
                        result2.Result = lstArtistSale.Take(2).ToList();
                        result2.Result.AddRange(lstEvent.Take(2).ToList());
                    }

                    #endregion
                    result.Result.AddRange(result2.Result);
                    return result;
                }
                result.Result = _startCenterThreeService.GetStartCenterThree(type).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
    }
}