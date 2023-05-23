using Microsoft.AspNetCore.Mvc;
using Nebb.Nss._2022.Aws.API.Helpers;
using Nebb.Nss._2022.Aws.Model.Entities;
using Nebb.Nss._2022.Aws.Service.Helpers;
using Nebb.Nss._2022.Aws.Service.Interfaces;

namespace Nebb.Nss._2022.Aws.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly ICosmosDbService _cosmosDbService;
        private readonly IBlobService _blobService;
        private readonly IUploadService _uploadService;
        private readonly MediaFilesValidator validator = new MediaFilesValidator();

        public FilesController(ICosmosDbService cosmosDbService, IBlobService blobService, IUploadService uploadService)
        {
            _cosmosDbService = cosmosDbService ?? throw new ArgumentNullException(nameof(cosmosDbService));
            _blobService = blobService;
            _uploadService = uploadService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MediaFiles>> GetFile(string id)
        {
            var mediaFile = await _cosmosDbService.GetAsync(id);
            if (mediaFile == null)
            {
                return NotFound();
            }

            return Ok(mediaFile);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MediaFiles>>> GetAllFiles([FromQuery] QueryStringParameters queryParams)
        {
            try
            {
                var mediaFiles = await _cosmosDbService.GetMultipleAsync(queryParams, "SELECT * FROM c");

                Response.AddPaginationHeader(new PaginationHeader(mediaFiles.CurrentPage, mediaFiles.PageSize,
                mediaFiles.TotalCount, mediaFiles.TotalPages));

                return Ok(mediaFiles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<MediaFiles>> UploadFile()
        {
            try
            {
                var file = Request.Form.Files[0];
                var result = validator.Validate(file);

                if (!result.IsValid)
                {
                    return BadRequest(result.Errors);
                }

                var mediaFile = await _uploadService.UploadFileAsync(file);

                return CreatedAtAction(nameof(GetFile), new { id = mediaFile.Value.Id }, mediaFile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPut("Edit")]
        public async Task<IActionResult> EditFile([FromBody] MediaFiles file)
        {
            try
            {
                await _cosmosDbService.UpdateAsync(file.Id, file);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut("Archive/{id}")]
        public async Task<IActionResult> SoftDeleteFile(string id)
        {
            var mediaFile = await _cosmosDbService.GetAsync(id);
            if (mediaFile == null)
            {
                return NotFound();
            }

            await _cosmosDbService.SoftDeleteAsync(mediaFile.Id);

            return NoContent();
        }

        [HttpPut("Restore/{id}")]
        public async Task<IActionResult> RestoreDeletedFiles(string id)
        {
            var mediaFile = await _cosmosDbService.GetAsync(id);
            if (mediaFile == null)
            {
                return NotFound();
            }

            await _cosmosDbService.RestoreDeletedFilesAsync(mediaFile.Id);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(string id)
        {
            var blobDeleteResult = await _blobService.DeleteBlob(id, "files");
            if (!blobDeleteResult)
            {
                return BadRequest("Could not delete the file from Blob storage");
            }

            var mediaFile = await _cosmosDbService.GetAsync(id);
            if (mediaFile == null)
            {
                return NotFound();
            }

            await _cosmosDbService.DeleteAsync(id);

            return NoContent();
        }
    }
}
