from urllib import request
from project import Project
import toml



class ProjectReader:
    def __init__(self, url):
        self._url = url

    def get_project(self):
        content = request.urlopen(self._url).read().decode("utf-8")
        parsed_content = toml.loads(content)['tool']['poetry']
        
        name = parsed_content['name']
        description =  parsed_content['description']
        dependencies = parsed_content['dependencies']
        dev_deps = parsed_content['group']['dev']['dependencies']
        authors = parsed_content['authors']
        license = parsed_content['license']

        return Project(name, description, dependencies, dev_deps, authors, license)
