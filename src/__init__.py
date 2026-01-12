"""Top-level package for the project source modules.

This file exposes the main subpackages so importing the project as a package
is clearer (e.g. `import src; src.preprocessing`).

Note: runtime imports like `from preprocessing.preprocess import TextPreprocessor`
still require the project `src` directory on `sys.path` (or running the script
from the repository root where `preprocess_data.py` appends `src` to sys.path).
"""

__version__ = "0.1.0"

from . import preprocessing  # re-export the preprocessing subpackage
from . import recommendation  # re-export the recommendation subpackage

__all__ = ["preprocessing", "recommendation"]

