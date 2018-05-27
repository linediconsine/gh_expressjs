const GitHubClient = require('./github-client');
const superagent = require('superagent');
const superagent_mock = require('superagent-mocker')(superagent); // Only for DEV env -- Installed with --save-dev


describe('githubClient', () => {

    test('createPage ##  data should provide a obj with search data', () => {

		const githubClient = new GitHubClient(superagent);
        const query = {}
        query.u = "testuser";
        query.r = 10;
        query.f = 10;
        
		const actual = githubClient.createPageData(query)
        const expected =  {"follower": 10, "repos": 10, "user": "testuser"};

		return expect(actual).toEqual(expected);

    });
    
    test('createPage ## repos parameter should be a number', () => {

		const githubClient = new GitHubClient(superagent);
        const query = {}
        query.u = "testuser";
        query.r = "string";
        query.f = "10";
        
        const actual = githubClient.createPageData(query)
        
        const expected =  {"follower": 10, "repos": 0, "user": "testuser"};

		return expect(actual).toEqual(expected);

    });

	test('githubClient shold initialize correctly', () => {

		expect(() => {
			const githubClient = new GitHubClient();
		}).not.toThrow();

	});

	test('githubClient shold generate query', () => {
		const githubClient = new GitHubClient();

		const actual = githubClient.buildSearchQuery({
			u: "testuser",
			r: "1",
			f: "2"
		})
		const expected = 'q=testuser+repos:>1+followers:>2'

		expect(actual).toBe(expected);

	});

	test('githubClient should search', () => {
		const githubResponse = {
                  "foo": "bar",
            };
        
		const githubClient = new GitHubClient(superagent);

		superagent_mock.get('*', function (req) {
			return {
				text: JSON.stringify(githubResponse)
			}

		});

		const actual = githubClient.userSearch({
			u: "testuser",
			r: "1",
			f: "2"
        })
        
        const expected =  {"json": {"foo": "bar"}, 
                           "pageData": {"follower": 2, 
                                        "repos": 1, 
                                        "user": "testuser"}}

		return expect(actual).resolves.toEqual(expected);

    });
    


})


