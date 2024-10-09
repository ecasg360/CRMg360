namespace GerenciaMusic360.Entities
{
    public class MethodResponse<T>
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public T Result { get; set; }
    }
}
