from setuptools import setup, find_packages

# The README.txt file should be written in reST so that PyPI can use
# it to generate your project's PyPI page.
long_description = open('README.txt').read()

setup(
    name='XStatic-Angular',
    summary="""Angular 1.4.10 (XStatic packaging standard)""",
    description=long_description,
    maintainer="Rob Cresswell",
    maintainer_email='robert.cresswell@outlook.com',
    use_scm_version=True,
    setup_requires=['setuptools_scm', 'wheel'],
    packages=find_packages(),
    include_package_data=True
)
