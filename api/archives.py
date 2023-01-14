import os
import tarfile
import fnmatch
import shutil
from pathlib import Path


def extract_files(filename, search_criteria=None, output_path='.'):
    """Extract all files or specific files from .tar or .tar.gz files.
    
    Parameters
    ----------
    filename : str, path-like object
        Name of the file to extract from.
    
    search_criteria : list, default is None
        List of criteria for finding files. By default, all files
        are extracted.

        Example - find all files with a '.pdf' or '.xlsx' extension.

            search_criteria = ['*.pdf', '*.xlsx']
    
    output_path : str, default is current working directory
        Path where the extracted files will be stored.
    
    Returns
    -------
    dict
        Info containing filename, total files in the file, and the
        number of files that were extracted.
    """

    # Initialize info
    info = {'filename': filename, 'total_files': 0, 'found_files': 0}

    # Determine mode
    mode = 'r:' if ''.join(Path(filename).suffixes).lower() == '.tar' else 'r:gz'

    with tarfile.open(filename, mode=mode) as tar:
        if search_criteria: # Extract files based on search criteria
            for member in tar:
                info['total_files'] += 1
                if any(fnmatch.fnmatch(member.name, ext) for ext in search_criteria):
                    tar.extract(member.name, path=output_path)
                    info['found_files'] += 1
        else: # Extract all files
            for member in tar:
                info['total_files'] += 1
                tar.extract(member.name, path=output_path)
                info['found_files'] += 1
    
    return info


def create_archive(folder, extension='.tar.gz', format='PAX', remove_directory=False):
    """Create an archive file.
    
    Parameters
    ----------
    folder : str, path-like object
        Name of the folder to archive.
    
    extension : str, '.tar' or '.tar.gz' (default)
        File extension for archive file.
    
    format : str, 'PAX' (default) or 'GNU'
        Archive file format.
    
    remove_directory : bool, default is False
        Option to remove folder after the archive file is created.

    Returns
    -------
    dict
        Info containing filename and the total files included in the
        archive file.
    """

    # Build filename
    filename = os.path.join(Path(folder).parent, Path(folder).name + extension)

    # Initalize info
    info ={'filename': filename, 'total_files': 0}

    # Determine mode
    mode = 'x:' if extension.lower() == '.tar' else 'x:gz'

    # Set format
    if format == 'PAX':
        fmt = tarfile.PAX_FORMAT
    elif format == 'GNU':
        fmt = tarfile.GNU_FORMAT
    
    with tarfile.open(filename, mode=mode, format=fmt) as tar:
        for dirpath, _, filenames in os.walk(folder):
            if filenames:
                for file in filenames:
                    # arcname provides an alternate name that is relative
                    # to the folder being archived
                    altname = Path(os.path.join(dirpath, file)).relative_to(Path(folder).parent)

                    tar.add(Path(os.path.join(dirpath, file)), recursive=False, arcname=altname)
                    info['total_files'] += 1
    
    if remove_directory:
        shutil.rmtree(folder)
    
    return info
