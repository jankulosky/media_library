using Nebb.Nss._2022.Aws.Database.Interfaces.Dummy;
using Nebb.Nss._2022.Aws.Model.Dummy;
using Nebb.Nss._2022.Aws.Service.Interfaces.Dummy;

namespace Nebb.Nss._2022.Aws.Service.Services
{
    public class DummyService : IDummyService
    {
        private readonly IDummyRepository _dummyRepository;

        public DummyService(IDummyRepository dummyRepository)
        {
            _dummyRepository = dummyRepository;
        }

        public async Task<DummyInfo> GetDummyInfoAsync()
        {
            var dummyInfo = await _dummyRepository.GetDummyDataAsync();
            return await Task.FromResult(dummyInfo);

        }
    }
}
