using Microsoft.AspNetCore.Http;
namespace Nebb.Nss._2022.Aws.Service.Helpers
{
    public static class FileTypeThumbnailHelper
    {
        public static string CheckFileType(IFormFile file, string fileName, string thumbnail)
        {
            List<string> imageExtensions = new List<string> { ".jpg", ".jpeg", ".png" };
            List<string> audioExtensions = new List<string> { ".mp3", ".wav" };
            List<string> videoExtensions = new List<string> { ".mp4", ".avi" };

            var extension = Path.GetExtension(file.FileName).ToLower();
            if (imageExtensions.Contains(extension))
            {
                return fileName;
            }
            else if (videoExtensions.Contains(extension))
            {
                return thumbnail;
            }
            else if(audioExtensions.Contains(extension))
            {
                return "https://d33v4339jhl8k0.cloudfront.net/docs/assets/591c8a010428634b4a33375c/images/5ab4866b2c7d3a56d8873f4c/file-MrylO8jADD.png";
            }
            else
            {
                return "";
            }
        }
    }
}
