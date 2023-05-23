using Nebb.Nss._2022.Aws.Model.Dummy;

namespace Nebb.Nss._2022.Aws.Service.Interfaces.Dummy
{
    public interface IDummyService
    {
        Task<DummyInfo> GetDummyInfoAsync();
    }
}
