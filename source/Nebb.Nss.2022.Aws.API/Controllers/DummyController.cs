using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Nebb.Nss._2022.Aws.API.Container;
using Nebb.Nss._2022.Aws.Model.Dummy;
using Nebb.Nss._2022.Aws.Service.Interfaces.Dummy;

namespace Nebb.Nss._2022.Aws.API.Controllers
{
    [EnableCors(NebbNssAwsExtension.AngularUiOrigins)]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class DummyController : ControllerBase
    {
        private readonly IDummyService _dummyService;

        public DummyController(IDummyService dummyService) 
        {
            _dummyService = dummyService;
        }

        [HttpGet("{id}")]
        public async Task<DummyInfo> Get(string id)
        {
            var dummyInfo = await _dummyService.GetDummyInfoAsync();
            return await Task.FromResult(dummyInfo);
        }
    }
}