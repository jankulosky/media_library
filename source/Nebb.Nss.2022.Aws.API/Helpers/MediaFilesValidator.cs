using FluentValidation;

namespace Nebb.Nss._2022.Aws.API.Helpers
{
    public class MediaFilesValidator : AbstractValidator<IFormFile>
    {
        private static List<string> validFileExtensions = new List<string> { ".jpg", ".jpeg", ".png", ".mp4", ".avi", ".mp3", ".wav" };
        public MediaFilesValidator()
        {
            RuleFor(x => x.FileName).Must(IsValidFileExtension).WithMessage("Invalid file type.");
            RuleFor(x => x.Length).GreaterThan(0).WithMessage("File is empty.");
            RuleFor(x => x.Length).LessThanOrEqualTo(52428800).WithMessage("File size is too large.");
        }
        public static bool IsValidFileExtension(string fileName)
        {
            string fileExtension = Path.GetExtension(fileName).ToLower();
            return validFileExtensions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase);
        }
    }
}
