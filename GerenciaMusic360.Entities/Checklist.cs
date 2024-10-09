using System;

namespace GerenciaMusic360.Entities
{
    public class Checklist
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Terms { get; set; }
        public string ContactType { get; set; }
        public int Deal { get; set; }
        public DateTime DateContact { get; set; }
        public string By { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
    }
}
