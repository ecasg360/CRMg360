using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Entities.ModelView
{
    public class SignalResponse
    {
        public List<long> UsersIds { get; set; }
        public List<string> UsersGuids { get; set; }
        public string Message { get; set; }
    }
}
