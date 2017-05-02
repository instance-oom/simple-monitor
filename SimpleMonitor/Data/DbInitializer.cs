namespace SimpleMonitor.Data
{
    public static class DbInitializer
    {
        public static void Initialize(MonitorDbContext dbContext)
        {
            dbContext.Database.EnsureCreated();
        }
    }
}
