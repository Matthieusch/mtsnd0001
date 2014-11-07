# SASS project structure

Inspired by http://www.sitepoint.com/architecture-sass-project/

sass/
|
|– base/
|   |– _reset.sass       # Reset/normalize
|   |– _typography.sass  # Typography rules
|
|– components/
|   |– _buttons.sass     # Buttons
|   |– _fields.sass      # Fields
|
|– helpers/
|   |– _variables.sass   # Sass Variables
|   |– _functions.sass   # Sass Functions
|   |– _mixins.sass      # Sass Mixins
|   |– _helpers.sass     # Class & placeholders helpers
|   |– _rem.sass         # Sass mixin and function to use rem units with pixel fallback
|
|– layout/
|   |– _grid.sass        # Grid system
|   |– _header.sass      # Header
|   |– _panel.sass       # Panel
|   |– _footer.sass      # Footer
|   |– _sidebar.sass     # Sidebar
|   |– _forms.sass       # Forms
|
|– pages/
|   |– _home.sass        # Home specific styles
|   |– _contact.sass     # Contact specific styles
|
|– vendors/
|   |– ...
|
|
`– _breakpoints.sass     # Breakpoints Sass file
`– screen.sass           # Screen Sass file
`– print.sass            # Print Sass file
`– wysiwyg.sass          # Wysiwyg Sass file
