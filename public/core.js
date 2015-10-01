$(document).ready(function() {
    var subject = $('#subject').val();
    var grade = $('#gradeLevel').val();
    if (grade > 8) {
        grade = "HS";
    }
    var url = 'http://www.AccessToCommonCore.com/api/' + subject + '/' + grade;
    console.log(url);
    $.support.cors = true;

    $.ajax({
        type: 'GET',
        url: url,
        accept: 'application/json',
        dataType: 'json',
        success: function(data) {
            makeCommonCoreList(data);
        },
        error: function() {
            alert('standards get failed!');
        }
    });
});

function makeCommonCoreList(response) {
    var commonCore = response.data.common_core.children;
    formatDisplayHeaders(response.data.common_core);
    var content = '';

    $.each(commonCore, function(j, domainORstrand) {
        content += formatDomainOrStrand(domainORstrand);

        if (domainORstrand.hasOwnProperty('children')) {
            $.each(domainORstrand.children, function(k, cluster) {
                content += formatCluster(cluster);

                if (cluster.hasOwnProperty('children')) {
                    content += formatBeginList();
                    $.each(cluster.children, function(l, standard) {
                        content += formatStandard(standard);

                        if (standard.hasOwnProperty('children')) {
                            content += formatBeginList();
                            $.each(standard.children, function(m, standardDetail) {
                                content += formatStandardDetail(standardDetail)
                            });
                            content += formatEndList();
                        }
                    });
                    content += formatEndList();
                }
            });
        }
    });

    $(content).appendTo("#list-of-standards");
}

function formatDomainOrStrand(domain) {
    return ('<h3>' + domain.standard + '</h3>');
}

function formatCluster(cluster) {
    return ('<h4>' + cluster.standard + '</h4>');
}

function formatStandard(standard) {
    return ('<li><a>' + standard.standard_code + '</a> ' + standard.standard + '</li>');
}

function formatStandardDetail(standardDetail) {
    return ('<li><a>' + standardDetail.standard_code + '</a> ' + standardDetail.standard + '</li>');
}

function formatBeginList() {
    return ('<ul>');
}

function formatEndList() {
    return ('</ul>');
}

function formatDisplayHeaders(firstStandard) {
    var content = '<h3><p>' + firstStandard.standard + '</p><h3>';
    $(content).appendTo("#curriculum-grade-header");
}
