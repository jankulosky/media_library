using Moq;
using Microsoft.AspNetCore.Http;
using Nebb.Nss._2022.Aws.Model.Entities;
using Nebb.Nss._2022.Aws.Service.Interfaces;
using Nebb.Nss._2022.Aws.Service.Services;
using Microsoft.AspNetCore.Mvc;

namespace Nebb.Nss._2022.Aws.Tests
{
    [TestClass]
    public class UploadServiceTests
    {
        private Mock<IBlobService> _mockBlobService;
        private Mock<ICosmosDbService> _mockCosmosDbService;
        private UploadService _uploadService;

        [TestInitialize]
        public void TestInitialize()
        {
            _mockBlobService = new Mock<IBlobService>();
            _mockCosmosDbService = new Mock<ICosmosDbService>();
            _uploadService = new UploadService(_mockBlobService.Object, _mockCosmosDbService.Object);
        }

        [TestMethod]
        public async Task TestUploadFileAsync()
        {
            // Arrange
            var file = new Mock<IFormFile>();
            file.Setup(f => f.FileName).Returns("testfile.png");
            file.Setup(f => f.Length).Returns(1024);
            file.Setup(f => f.ContentType).Returns("image/png");


            var mediaFile = new MediaFiles
            {
                Id = Guid.NewGuid().ToString() + Path.GetExtension(file.Object.FileName),
                Name = "testfile.png",
                Type = "image/png",
                Size = 1024,
                CreatedAt = DateTime.Now,
                LastModifiedAt = DateTime.Now,
                ThumbnailUrl = "https://example.com/testfile.png",
                FileUrl = "https://example.com/testfile.png"
            };

            _mockBlobService.Setup(bs => bs.UploadBlob(It.IsAny<string>(), It.IsAny<IFormFile>(), It.IsAny<string>())).ReturnsAsync(true);
            _mockBlobService.Setup(bs => bs.GetBlob(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync("https://example.com/testfile.png");
            _mockCosmosDbService.Setup(cs => cs.AddAsync(It.IsAny<MediaFiles>())).Returns(Task.CompletedTask);


            // Act
            var result = await _uploadService.UploadFileAsync(file.Object);

            // Assert
            _mockBlobService.Verify(bs => bs.UploadBlob(It.IsAny<string>(), It.IsAny<IFormFile>(), It.IsAny<string>()), Times.Once);
            _mockBlobService.Verify(bs => bs.GetBlob(It.IsAny<string>(), It.IsAny<string>()), Times.Exactly(2));
            _mockCosmosDbService.Verify(cs => cs.AddAsync(It.IsAny<MediaFiles>()), Times.Once);

            Assert.IsInstanceOfType(result, typeof(ActionResult<MediaFiles>));
            Assert.IsNotNull(result);

        }
    }
}