NEXT UPDATES
============

- Make sure file lists are sorted nicely

- Additional contour options:

  - z axis label
  - min, max, and interval of colorbar

- Add 3d surface options

- Express service feature

- Add options for vertical and horizontal lines, shapes,
  annotations, etc

- File Options: Add radio buttons for file select
  and add presets for skiprows etc when different
  files are selected. Show/hide additional options
  that are applicable.

- Add options for secondary x axis (mainly for bar/scatter overlay)

- Add button to open dev tools on sidebar

KNOWN ISSUES
============

- Added new bar data after labels were added removes
  the labels because the response does not have text
  and textposition

- Right now, if new data is loaded, any existing plots
  will not be able to access it. Instead of getting
  whatever data is loaded when a new plot is added to
  the page, add a dependency to the useEffect() to detect
  when new data is loaded, so all existing plots will
  have access to the data.

General
=======

- Does it make sense to create a custom useFetch hook? (#137, https://fluor.udemy.com/course/react-tutorial-and-projects-course/learn/lecture/36179346#overview)

- Move connect/disconnect sockets to top level of App

- Try opening new BrowserWindow to "pop out" plot containers
  of main window

- Add .db file to track who is using the wetbar and how many
  times they've used it.

- Display version somewhere in main window and try to add to
  folder created when packaging app

Docs
====

- Update docs

Plots
=====

- Add scale factor

- Confirm loading spinner stops if error occurs when reading
  files

- Make paper color the background color for the div so that
  there's no white space where the collapse button is

- Add color picker for line colors

- Limit the number of items that show in the X and Y parameter
  select components with scroll

- Add options for more than two x or y axes

SpaceUtilization
================

- Add plot and table data to redux state.

- Figure out how to delay rendering of plot.

  - When the depth changes, the items don't disappear until
    the plot is rendered. 

- Add loading spinner to plot that appears after data has been
  loaded to indicate the plot is rendering. Also include spinner
  when depth changes or folder is clicked to indicated a new plot
  is rendering.

- Consider adding checkbox to table that allow the user to
  delete extensions after code has run so they don't have to
  go to File Cleanup, find the files again, then delete them.
  This would remove one extra step.

- Incorporate multiprocessing on child folders

Cleanup
=======

- Incorporate multiprocessing if more than one folder exists

- Add option for deleting empty folders

Backend
=======

- Add list option to view contents of tar file

- Add sockets to emit progress (use flask-socketio package)

- Test all parts of code that use winapi_path to make sure it works

File Options
============

- Instead of a folder icon next to each folder/file, add a button that
  opens a modular window for file options. Include a "preview" data
  section and show available Excel sheets in a list. If this is implemented,
  need to figure out how to globally apply settings so someone doesn't
  have to go into 10 different folders. Maybe keep the current file options,
  if if a checkbox is selected in the modular window, then those file options
  will be used instead of the global ones.

Settings
========

- Allow people to customize certain options and always load
  their custom options.

  - Default output directory

  - Default file extension to search when extract files

  - Default files to delete when cleaning up files