using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class ProjectState
    {
        public int Id { get; set; }
        public int StatusProjectId { get; set; }
        public DateTime Date { get; set; }
        public string Notes { get; set; }
        public long ApproverUserId { get; set; }
        public int ProjectId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }

        public virtual StatusProject StatusProject { get; set; }
        [ForeignKey("ApproverUserId")]
        public virtual UserProfile UserProfile { get; set; }
    }
}
