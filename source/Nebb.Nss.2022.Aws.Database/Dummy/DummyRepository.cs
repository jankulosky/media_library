using Nebb.Nss._2022.Aws.Database.Interfaces.Dummy;
using Nebb.Nss._2022.Aws.Model.Dummy;

namespace Nebb.Nss._2022.Aws.Database.Dummy
{
    public class DummyRepository : IDummyRepository
    {
        public async Task<DummyInfo> GetDummyDataAsync()
        {
            var dummyInfo = new DummyInfo();
            dummyInfo.Id = Guid.NewGuid();
            dummyInfo.Name = "Dummy Name";
            return await Task.FromResult(dummyInfo);

        }
    }
}
