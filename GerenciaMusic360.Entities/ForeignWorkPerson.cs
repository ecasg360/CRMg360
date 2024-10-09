namespace GerenciaMusic360.Entities
{
    public partial class ForeignWorkPerson
    {
        public int Id { get; set; }
        public int ForeignWorkId { get; set; }
        public int PersonId { get; set; }
        public ForeignWork ForeignWork { get; set; }
        public Person Person { get; set; }
    }
}
