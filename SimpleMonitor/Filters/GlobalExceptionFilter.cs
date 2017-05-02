using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SimpleMonitor.Models;

namespace SimpleMonitor.Filters
{
    public class GlobalExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var response = new ErrorResponse
            {
                Message = context.Exception.Message,
                StackTrace = context.Exception.StackTrace
            };
            context.Result = new ObjectResult(response)
            {
                StatusCode = 500,
                DeclaredType = typeof(ErrorResponse)
            };
        }
    }
}
