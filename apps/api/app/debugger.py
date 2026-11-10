import io
import sys
import copy
from typing import Dict, Any, List

def trace_execution(source_code: str, max_steps: int = 150) -> Dict[str, Any]:
    steps: List[Dict[str, Any]] = []
    stdout_capture = io.StringIO()
    old_stdout = sys.stdout

    step_counter = [0]
    terminated = [False]

    def safe_repr(val: Any) -> str:
        try:
            if isinstance(val, (int, float, bool, str, list, dict, set, tuple)):
                r = repr(val)
                return r if len(r) < 120 else r[:117] + "..."
            return f"<{type(val).__name__} object>"
        except Exception:
            return "<unprintable>"

    def tracer(frame, event, arg):
        if terminated[0] or step_counter[0] >= max_steps:
            terminated[0] = True
            return None

        # Only trace the user's code module, not internal libraries
        if frame.f_code.co_filename != "<string>":
            return tracer

        if event in ("line", "call", "return"):
            step_counter[0] += 1
            line_no = frame.f_lineno

            # Capture user variables (ignore dunders and modules)
            local_vars = {}
            for k, v in frame.f_locals.items():
                if not k.startswith("__") and not hasattr(v, "__file__"):
                    local_vars[k] = safe_repr(v)

            # Capture call stack
            call_stack = []
            curr = frame
            while curr and curr.f_code.co_filename == "<string>":
                func_name = curr.f_code.co_name
                call_stack.append(func_name if func_name != "<module>" else "main")
                curr = curr.f_back

            steps.append({
                "step_number": step_counter[0],
                "line": line_no,
                "event": event,
                "variables": local_vars,
                "call_stack": list(reversed(call_stack)),
                "stdout_so_far": stdout_capture.getvalue()
            })

        return tracer

    try:
        sys.stdout = stdout_capture
        sys.settrace(tracer)
        compiled_code = compile(source_code, "<string>", "exec")
        sandbox_globals = {
            "__name__": "__main__",
            "__builtins__": __builtins__
        }
        exec(compiled_code, sandbox_globals)
    except Exception as e:
        sys.settrace(None)
        sys.stdout = old_stdout
        return {
            "status": "error",
            "steps": steps,
            "total_steps": len(steps),
            "error": f"{type(e).__name__}: {str(e)}"
        }
    finally:
        sys.settrace(None)
        sys.stdout = old_stdout

    return {
        "status": "success",
        "steps": steps,
        "total_steps": len(steps),
        "error": None
    }

