NEXT UPDATES
============

- Additional contour options:

  - z axis label
  - min, max, and interval of colorbar

- Add 3d surface, 3d scatter options

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

- Move connect/disconnect sockets to top level of App

- Try opening new BrowserWindow to "pop out" plot containers
  of main window

- Add .db file to track who is using the wetbar and how many
  times they've used it.

- Display version somewhere in main window and try to add to
  folder created when packaging app

- Prevent switching routes if code is running, might be able to use
  Context API for determine when app is running or Redux

- Consider incorporating Context API for managing state when
  switching routes, or use Redux. See these videos https://fluor.udemy.com/course/react-tutorial-and-projects-course/learn/lecture/36180334#overview

Docs
====

- Update docs

Plots
=====

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