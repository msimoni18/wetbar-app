import os
import glob
from collections import Counter
from pathlib import Path
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import plotly.graph_objects as go
from PyPDF3 import PdfFileMerger


def get_common_parameters(data):
    """Get common parameters between all data.
    
    Parameters
    ----------
    data : dict
      Dictionary containing data in the following form:
        {
          '/fullpath/to/file1.csv': {
            'df': pd.DataFrame(),
            'parameters': df.columns.tolist()
          },
          '/fullpath/to/file2.csv': {
            'df': pd.DataFrame(),
            'parameters': df.columns.tolist()
          }
        }
    
    Returns
    -------
    list
      List of common parameters between all files.
    """
    file_count = 0
    parameters = []

    for key in data:
        for parameter in data[key]['parameters']:
            parameters.append(parameter)
        file_count += 1
    
    common_parameters = []
    parameter_count = Counter(parameters)
    for parameter, count in parameter_count.items():
        if count == file_count:
            common_parameters.append(parameter)
    return common_parameters


class ExpressService:
    
    """
    Attributes
    ----------
    data : dict
      Dictionary containing data in the following form:
        {
          '/fullpath/to/file1.csv': {
            'df': pd.DataFrame(),
            'parameters': df.columns.tolist(),
            'name': name
          },
          '/fullpath/to/file2.csv': {
            'df': pd.DataFrame(),
            'parameters': df.columns.tolist(),
            'name': name
          }
        }

    parameters : list
      List of parameters to plot.
    
    output_filename: str
      Full path of PDF output file.
      Example: /full/path/to/plots.pdf
    """
    
    def __init__(self, data, parameters, output_filename):
        self.data = data
        self.parameters = parameters
        self.output_filename = output_filename

    def create_matplotlib_plots(self, save_pngs=False):
        """Create matplotlib plots.

        Parameters
        ----------
        save_pngs : bool
          Flag for saving individual png files.

        Returns
        -------
        N/A
        """

        pdf = PdfPages(self.output_filename)

        for i, parameter in enumerate(self.parameters, start=1):
            print(f'({i}/{len(self.parameters)}): {parameter}')

            fig, ax = plt.subplots(nrows=1, ncols=1)

            for key in self.data:
                df = self.data[key]['df']
                name = self.data[key]['name']

                ax.plot(df['tran_time'], df['parameter'], label=name)
            
            ax.legend()
            ax.set_xlabel('tran_time')
            ax.set_ylabel(parameter)

            fig.tight_layout()
            if save_pngs:
              output_dir = Path(self.output_filename).parent
              fig.savefig(os.path.join(output_dir, f'{parameter}.png'))
            pdf.savefig(fig)
            plt.close()

    def create_plotly_plots(self, save_pngs=False, save_html=False):
        """Create plotly plots.

        Parameters
        ----------
        save_pngs : bool
          Flag for saving individual png files.
        
        save_html : bool
          Flag for saving individual html files.

        Returns
        -------
        N/A
        """

        for i, parameter in enumerate(self.parameters, start=1):
            print(f'({i}/{len(self.parameters)}): {parameter}')

            fig = go.Figure()

            for key in self.data:
                df = self.data[key]['df']
                name = self.data[key]['name']

                fig.add_trace(go.Scatter(
                    x=df['tran_time'],
                    y=df[parameter],
                    name=name
                ))
            
            fig.update_layout({
                'xaxis': {
                    'title': 'tran_time',
                },
                'yaxis': {
                    'title': parameter
                }
            })

            output_dir = Path(self.output_filename).parent
            if save_pngs:
                fig.write_image(os.path.join(output_dir, f'{parameter}.png'))
            if save_html:
                fig.write_html(os.path.join(output_dir, f'{parameter}.html'))
            
            fig.write_image(os.path.join(output_dir, f'__{parameter}.pdf'))

        # Combine individual PDFs, then delete.
        pdf_files = glob.glob(os.path.join(output_dir), '__*.pdf')
        merger = PdfFileMerger()
        for f in pdf_files:
            merger.append(open(f, 'rb'))
            os.remove(f)
        
        with open(self.output_filename, 'wb') as output:
            merger.write(output)
