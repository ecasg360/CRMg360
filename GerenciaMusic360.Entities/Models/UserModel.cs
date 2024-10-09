namespace GerenciaMusic360.Entities.Models
{
    public class UserModel
    {
        public long Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string SecondLastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneOne { get; set; }
        public string Birthdate { get; set; }
        public string Gender { get; set; }
        public short Status { get; set; }
        public string PictureUrl { get; set; }
        public int RoleId { get; set; }
        public string Role { get; set; }
        public int? DepartmentId { get; set; }
    }
}
