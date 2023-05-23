using Nebb.Nss._2022.Aws.Model.Dummy;

namespace Nebb.Nss._2022.Aws.Database.Interfaces.Dummy
{
    public interface IDummyRepository
    {
        Task<DummyInfo> GetDummyDataAsync();
    }
}
