using System;

namespace GerenciaMusic360.Entities
{
    public class UserProfile
    {
        public long Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string SecondLastName { get; set; }
        public string PhoneOne { get; set; }
        public string PhoneTwo { get; set; }
        public DateTime Brithdate { get; set; }
        public string Gender { get; set; }
        public string PictureUrl { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }
        public int? DepartmentId { get; set; }
        public string Role { get; set; }

    }
}
