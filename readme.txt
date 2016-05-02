
// showGroup page
            <div class="col-md-2">
                <form action="/groups/groups/<%= group._id %>/<%= currentUser._id %>/?_method=PUT" method="POST">
                    <button class="btn btn-large btn-primary btn-block"><i class="step forward icon"></i> Join Group</button>
                    <input type="text" name="user[groupId]" value="<%= group._id %>" hidden>
                </form>
            </div>