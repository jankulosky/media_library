using System;
using System.IO;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using System.Reflection.Metadata;
using FFMediaToolkit;
using FFMediaToolkit.Decoding;
using FFMediaToolkit.Graphics;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System.Collections.Generic;

namespace thumbnailFunctionTest
{
    public static class ThumbnailFunction
    {

        [FunctionName("GenerateThumbnailFunction")]
        public static void Run(
                [BlobTrigger("files/{name}", Connection = "BlobConnection")] Stream myBlob,
                [Blob("thumbnails/{name}.jpg", FileAccess.Write, Connection = "BlobConnection")] Stream outputBlob,
                string name,
                ExecutionContext executionContext,
                ILogger log)
        {
            log.LogInformation($"C# Blob trigger function processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");

            if (!FFmpegLoader.FFmpegPath.Equals(Path.Combine(executionContext.FunctionAppDirectory, "bin", "ffmpeg")))
            {
                try
                {
                    FFmpegLoader.FFmpegPath = Path.Combine(executionContext.FunctionAppDirectory, "bin", "ffmpeg");
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "Error loading FFmpeg assemblies.");
                    return;
                }
            }

            List<string> videoExtensions = new List<string> { ".mp4", ".avi" };
            var extension = Path.GetExtension(name).ToLower();
            if (videoExtensions.Contains(extension))
            {
                var file = MediaFile.Open(myBlob);
                file.Video.TryGetNextFrame(out var imageData);
                imageData.ToBitmap().SaveAsJpeg(outputBlob);
                log.LogInformation($"Thumbnail generated for {name}.");
            }
            else
            {
                log.LogInformation("Skipping non-video files.");
            }
        }
    }
    public static class Extensions
    {
        public static Image<Bgr24> ToBitmap(this ImageData imageData)
        {
            return Image.LoadPixelData<Bgr24>(imageData.Data, imageData.ImageSize.Width, imageData.ImageSize.Height);
        }
    }
}