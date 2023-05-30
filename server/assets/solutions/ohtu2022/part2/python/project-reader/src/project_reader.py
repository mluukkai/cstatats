from urllib import request
from project import Project
import toml


class ProjectReader:
    def __init__(self, url):
        self._url = url

    def get_project(self):
        content = request.urlopen(self._url).read().decode("utf-8")
        parsed_toml = toml.loads(content)['tool']['poetry']

        return Project(parsed_toml['name'], parsed_toml['description'], parsed_toml['dependencies'], parsed_toml['dev-dependencies'])
