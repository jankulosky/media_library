using Microsoft.Azure.Cosmos;
using Moq;
using Nebb.Nss._2022.Aws.Model.Entities;
using Nebb.Nss._2022.Aws.Service.Services;

namespace Nebb.Nss._2022.Aws.Tests
{
    [TestClass]
    public class CosmosDbServiceTests
    {
        private CosmosDbService _cosmosDbService;
        private Mock<CosmosClient> _mockCosmosClient;
        private Mock<Container> _mockContainer;
        private readonly string _databaseName = "testDatabase";
        private readonly string _containerName = "testContainer";

        [TestInitialize]
        public void TestInitialize()
        {
            var mediaFile = new MediaFiles
            {
                Id = "asdf",
                Name = "testfile.png",
                Type = "image/png",
                Size = 1024,
                CreatedAt = new DateTime(2021, 07, 28),
                LastModifiedAt = new DateTime(2021, 07, 28),
                ThumbnailUrl = "https://example.com/testfile.png",
                FileUrl = "https://example.com/testfile.png"
            };

            var responseMock = new Mock<ItemResponse<MediaFiles>>();
            responseMock.Setup(x => x.Resource).Returns(mediaFile);

            _mockContainer = new Mock<Container>();
            _mockContainer.Setup(x => x.ReadItemAsync<MediaFiles>("asdf", PartitionKey.None, null, default)).ReturnsAsync(responseMock.Object);

            _mockCosmosClient = new Mock<CosmosClient>();
            _mockCosmosClient.Setup(x => x.GetContainer(_databaseName, _containerName))
                .Returns(_mockContainer.Object);

            _cosmosDbService = new CosmosDbService(_mockCosmosClient.Object, _databaseName, _containerName);
        }
        [TestMethod]
        public async Task TestGetAsync()
        {
            // Arrange
            var expectedFile = new MediaFiles
            {
                Id = "asdf",
                Name = "testfile.png",
                Type = "image/png",
                Size = 1024,
                CreatedAt = new DateTime(2021, 07, 28),
                LastModifiedAt = new DateTime(2021, 07, 28),
                ThumbnailUrl = "https://example.com/testfile.png",
                FileUrl = "https://example.com/testfile.png"
            };

            // Act
            var result = await _cosmosDbService.GetAsync(expectedFile.Id);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(expectedFile.Id, result.Id);
            Assert.AreEqual(expectedFile.Name, result.Name);
            Assert.AreEqual(expectedFile.Type, result.Type);
            Assert.AreEqual(expectedFile.Size, result.Size);
            Assert.AreEqual(expectedFile.CreatedAt, result.CreatedAt);
            Assert.AreEqual(expectedFile.LastModifiedAt, result.LastModifiedAt);
            Assert.AreEqual(expectedFile.ThumbnailUrl, result.ThumbnailUrl);
            Assert.AreEqual(expectedFile.FileUrl, result.FileUrl);
        }

        [TestMethod]
        public async Task Test_UpdateAsync()
        {
            var expectedFile = new MediaFiles
            {
                Id = "asdf",
                Name = "testfile.png",
                Type = "image/png",
                Size = 1024,
                CreatedAt = new DateTime(2021, 07, 28),
                LastModifiedAt = new DateTime(2021, 07, 28),
                ThumbnailUrl = "https://example.com/testfile.png",
                FileUrl = "https://example.com/testfile.png"
            };
            bool updateAsyncCalled = false;

            _mockContainer.Setup(c => c.UpsertItemAsync(expectedFile, null, null, default)).Callback(() => updateAsyncCalled = true);
            // Act
            await _cosmosDbService.UpdateAsync(expectedFile.Id, expectedFile);
            // Assert
            _mockContainer.Verify(c => c.UpsertItemAsync(expectedFile, null, null, default), Times.AtLeastOnce);
            _mockContainer.Verify(c => c.UpsertItemAsync(It.IsAny<MediaFiles>(), null, null, default), Times.Once);
            Assert.IsTrue(updateAsyncCalled, "UpdateAsync was not called with the expected arguments.");
        }
        [TestMethod]
        public async Task Test_DeleteAsync()
        {
            var expectedFile = new MediaFiles
            {
                Id = "asdf",
                Name = "testfile.png",
                Type = "image/png",
                Size = 1024,
                CreatedAt = new DateTime(2021, 07, 28),
                LastModifiedAt = new DateTime(2021, 07, 28),
                ThumbnailUrl = "https://example.com/testfile.png",
                FileUrl = "https://example.com/testfile.png"
            };
            bool deleteAsyncCalled = false;

            _mockContainer.Setup(c => c.DeleteItemAsync<MediaFiles>(expectedFile.Id, PartitionKey.None, null, default)).Callback(() => deleteAsyncCalled = true);
            // Act
            await _cosmosDbService.DeleteAsync(expectedFile.Id);
            // Assert
            _mockContainer.Verify(c => c.DeleteItemAsync<MediaFiles>(expectedFile.Id, PartitionKey.None, null, default), Times.AtLeastOnce);
            Assert.IsTrue(deleteAsyncCalled, "DeleteAsync was not called with the expected arguments.");
        }
    }
}
