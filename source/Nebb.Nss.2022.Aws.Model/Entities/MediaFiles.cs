using Newtonsoft.Json;

namespace Nebb.Nss._2022.Aws.Model.Entities
{
    public class MediaFiles
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }
        public string FileUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastModifiedAt { get; set; }

        public string ThumbnailUrl { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
