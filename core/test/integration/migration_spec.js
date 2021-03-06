/*globals describe, before, beforeEach, afterEach, it */
var testUtils   = require('../utils'),
    should      = require('should'),
    sinon       = require('sinon'),
    _           = require('lodash'),
    Promise     = require('bluebird'),

    fixtures    = require('../../server/data/migration/fixtures'),
    Models      = require('../../server/models'),

    sandbox     = sinon.sandbox.create();

describe('Database Migration (special functions)', function () {
    before(testUtils.teardown);
    afterEach(testUtils.teardown);
    afterEach(function () {
        sandbox.restore();
    });

    describe('Fixtures', function () {
        // Custom assertion for detection that a permissions is assigned to the correct roles
        should.Assertion.add('AssignedToRoles', function (roles) {
            var roleNames;
            this.params = {operator: 'to have role'};

            should.exist(this.obj);

            this.obj.should.be.an.Object().with.property(['roles']);
            this.obj.roles.should.be.an.Array();
            roleNames = _.pluck(this.obj.roles, 'name');
            roleNames.should.eql(roles);
        });

        // Custom assertion to wrap all permissions
        should.Assertion.add('CompletePermissions', function () {
            this.params = {operator: 'to have a complete set of permissions'};
            var permissions = this.obj;

            // DB
            permissions[0].name.should.eql('Export database');
            permissions[0].should.be.AssignedToRoles(['Administrator']);
            permissions[1].name.should.eql('Import database');
            permissions[1].should.be.AssignedToRoles(['Administrator']);
            permissions[2].name.should.eql('Delete all content');
            permissions[2].should.be.AssignedToRoles(['Administrator']);

            // Mail
            permissions[3].name.should.eql('Send mail');
            permissions[3].should.be.AssignedToRoles(['Administrator']);

            // Notifications
            permissions[4].name.should.eql('Browse notifications');
            permissions[4].should.be.AssignedToRoles(['Administrator']);
            permissions[5].name.should.eql('Add notifications');
            permissions[5].should.be.AssignedToRoles(['Administrator']);
            permissions[6].name.should.eql('Delete notifications');
            permissions[6].should.be.AssignedToRoles(['Administrator']);

            // Posts
            permissions[7].name.should.eql('Browse posts');
            permissions[7].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[8].name.should.eql('Read posts');
            permissions[8].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[9].name.should.eql('Edit posts');
            permissions[9].should.be.AssignedToRoles(['Administrator', 'Editor']);
            permissions[10].name.should.eql('Add posts');
            permissions[10].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[11].name.should.eql('Delete posts');
            permissions[11].should.be.AssignedToRoles(['Administrator', 'Editor']);

            // Settings
            permissions[12].name.should.eql('Browse settings');
            permissions[12].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[13].name.should.eql('Read settings');
            permissions[13].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[14].name.should.eql('Edit settings');
            permissions[14].should.be.AssignedToRoles(['Administrator']);

            // Slugs
            permissions[15].name.should.eql('Generate slugs');
            permissions[15].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);

            // Tags
            permissions[16].name.should.eql('Browse tags');
            permissions[16].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[17].name.should.eql('Read tags');
            permissions[17].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[18].name.should.eql('Edit tags');
            permissions[18].should.be.AssignedToRoles(['Administrator', 'Editor']);
            permissions[19].name.should.eql('Add tags');
            permissions[19].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[20].name.should.eql('Delete tags');
            permissions[20].should.be.AssignedToRoles(['Administrator', 'Editor']);

            // Themes
            permissions[21].name.should.eql('Browse themes');
            permissions[21].should.be.AssignedToRoles(['Administrator']);
            permissions[22].name.should.eql('Edit themes');
            permissions[22].should.be.AssignedToRoles(['Administrator']);

            // Users
            permissions[23].name.should.eql('Browse users');
            permissions[23].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[24].name.should.eql('Read users');
            permissions[24].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
            permissions[25].name.should.eql('Edit users');
            permissions[25].should.be.AssignedToRoles(['Administrator', 'Editor']);
            permissions[26].name.should.eql('Add users');
            permissions[26].should.be.AssignedToRoles(['Administrator', 'Editor']);
            permissions[27].name.should.eql('Delete users');
            permissions[27].should.be.AssignedToRoles(['Administrator', 'Editor']);

            // Roles
            permissions[28].name.should.eql('Assign a role');
            permissions[28].should.be.AssignedToRoles(['Administrator', 'Editor']);
            permissions[29].name.should.eql('Browse roles');
            permissions[29].should.be.AssignedToRoles(['Administrator', 'Editor', 'Author']);
        });

        beforeEach(testUtils.setup());

        it('should populate all fixtures correctly', function (done) {
            var logStub = sandbox.stub();

            fixtures.populate({context: {internal: true}}, logStub).then(function () {
                var props = {
                    posts: Models.Post.findAll({include: ['tags']}),
                    tags: Models.Tag.findAll(),
                    users: Models.User.findAll({include: ['roles']}),
                    clients: Models.Client.findAll(),
                    roles: Models.Role.findAll(),
                    permissions: Models.Permission.findAll({include: ['roles']})
                };

                logStub.called.should.be.true();

                return Promise.props(props).then(function (result) {
                    should.exist(result);

                    // Post
                    should.exist(result.posts);
                    result.posts.length.should.eql(1);
                    result.posts.at(0).get('title').should.eql('Welcome to Ghost');

                    // Tag
                    should.exist(result.tags);
                    result.tags.length.should.eql(1);
                    result.tags.at(0).get('name').should.eql('Getting Started');

                    // Post Tag relation
                    result.posts.at(0).related('tags').length.should.eql(1);
                    result.posts.at(0).related('tags').at(0).get('name').should.eql('Getting Started');

                    // Clients
                    should.exist(result.clients);
                    result.clients.length.should.eql(2);
                    result.clients.at(0).get('name').should.eql('Ghost Admin');
                    result.clients.at(1).get('name').should.eql('Ghost Frontend');

                    // User (Owner)
                    should.exist(result.users);
                    result.users.length.should.eql(1);
                    result.users.at(0).get('name').should.eql('Ghost Owner');
                    result.users.at(0).related('roles').length.should.eql(1);
                    result.users.at(0).related('roles').at(0).get('name').should.eql('Owner');

                    // Roles
                    should.exist(result.roles);
                    result.roles.length.should.eql(4);
                    result.roles.at(0).get('name').should.eql('Administrator');
                    result.roles.at(1).get('name').should.eql('Editor');
                    result.roles.at(2).get('name').should.eql('Author');
                    result.roles.at(3).get('name').should.eql('Owner');

                    // Permissions
                    result.permissions.length.should.eql(30);
                    result.permissions.toJSON().should.be.CompletePermissions();

                    done();
                });
            }).catch(done);
        });
    });
});

