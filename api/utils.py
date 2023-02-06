import os
import re
import time
import concurrent.futures
import pandas as pd


def timer(func):
    """Decorator for timing functions."""

    def wrapper(*args, **kwargs):
        t1 = time.time()
        result = func(*args, **kwargs)
        t2 = time.time()
        print(f'Time to complete: {round((t2 - t1), 2)} seconds')
        return result

    return wrapper


def str2bool(v):
    """Convert string to boolean."""

    if isinstance(v, bool):
        return v
    elif v.lower() in ('true'):
        return True
    elif v.lower() in ('false'):
        return False


class Worker:
    """Class for multiprocessing."""

    def __init__(self, workers=1):
        self.workers = workers

    @timer
    def run(self, fn, files, **kwargs):
        num = len(files)
        with concurrent.futures.ProcessPoolExecutor(max_workers=self.workers) as executor:
            results = [executor.submit(fn, f, **kwargs) for f in files]
            for i, f in enumerate(concurrent.futures.as_completed(results), start=1):
                print(f'({i}/{num}): {f.result()}')


def str2list(item):

    try:
        new_item = [int(i) for i in item.strip('] [').split(', ')]
    except (ValueError, NameError):
        new_item = item.strip('] [').split(', ')

    # Strip spaces from front and back of string.
    # AttributeError occurs if list of ints.
    try:
        new_item = [i.strip() for i in new_item]
    except AttributeError:
        pass

    return new_item


def read_file(filename, **kwargs):
    # Enable long path
    filename = winapi_path(filename)

    if 'skiprows' in kwargs:
        kwargs['skiprows'] = str2list(kwargs['skiprows'])

    if 'sheet_name' in kwargs:
        kwargs['sheet_name'] = str2list(kwargs['sheet_name'])

    if str(filename).endswith('.xlsx'):
        if 'sheet_name' not in kwargs:
            kwargs['sheet_name'] = None

        try:
            df = pd.read_excel(filename, **kwargs)
            df = pd.concat(df, axis=1)
            df.columns = df.columns.droplevel()
            df = df.loc[:, ~df.columns.duplicated()]
        except Exception as err:
            raise Exception(f'{err} in {filename!r}.') from None

    elif str(filename).endswith('.rod'):
        if 'sep' not in kwargs:
            kwargs['sep'] = '\t'
        if 'skiprows' not in kwargs:
            kwargs['skiprows'] = [0, 2]
        df = pd.read_csv(filename, **kwargs)

    else:
        df = pd.read_csv(filename, **kwargs)

    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

    return df


def sort_nicely(lst):
    convert = lambda text: int(text) if text.isdigit() else text
    alpha_key = lambda key: [convert(c) for c in re.split('([0-9]+)', key)]
    return sorted(lst, key=alpha_key)


def winapi_path(dos_path, encoding=None):
    """Fix MAX_PATH character issue on Windows."""
    if not isinstance(dos_path, str) and encoding is not None:
        dos_path = dos_path.decode(encoding)

    path = os.path.abspath(dos_path)

    if path.startswith(u'\\\\'):
        return u'\\\\?\\UNC\\' + path[2:]

    return u'\\\\?\\' + path
