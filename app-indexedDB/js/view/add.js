var bookmarkRepo = require('data/bookmark-repository'),
    tagGroupRepo = require('data/tag-group-repository');

function getActiveTab(op) {
    console.log(chrome.tabs);
    if (chrome.tabs) {
        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
            // since only one tab should be active and in the current window at once
            // the return variable should only have one entry
            var activeTab = arrayOfTabs[0];
            op.success(activeTab);
        });
    } else {
        op.failure();
    }
}

module.exports = {
    name: 'AddCtrl',
    controller: function($scope, $location) {

        tagGroupRepo.loadAllTagsToCache({});

        getActiveTab({
            success: function (tab) {
                $scope.url = tab.url;
                $scope.title = tab.title;
                $scope.$apply();
            },
            failure: function () {
                $scope.url = window.location.href;
                $scope.title = window.document.title;
                $scope.$apply();
            }
        });

        $scope.getTags = function () {
            return tagGroupRepo.getAllTags();
        };

        $scope.save = function () {
            tagGroupRepo.add($scope.selectedTags, {
                success: function (tagGroup) {
                    bookmarkRepo.add({
                        title: $scope.title,
                        url: $scope.url,
                        dateAdded: new Date(),
                        tagGroupId: tagGroup.id
                    }, {
                        success: function () {
                            $location.path('/actions');
                        },
                        failure: function (results) {
                            console.log(results);
                        }
                    });
                }
            })
        };

        $scope.remove = function () {

        };
    }
};
