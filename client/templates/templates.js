angular.module("kitchenapp.templates").run(["$templateCache", function($templateCache) {$templateCache.put("cupboard/cupboard.html","<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h1>My Cupboard</h1>\n  </div>\n</div>\n<div class=\"row\" ng-if=\"gridOptions.data.length === 0\" ng-show=\"vm.loading\">\n  <div class=\"col-xs-12\">\n    <div class=\"loader\">Loading...</div>\n  </div>\n</div>\n<div class=\"row\" ng-show=\"!vm.loading\">\n  <div class=\"col-xs-12\">\n    <p ng-if=\"!vm.items.length > 0\">Your cupboard is empty!! Go to <a ui-sref=\"ingredients\">ingredients</a> to register ingredients or <a ui-sref=\"shop\">shop</a> to buy more.</p>\n  </div>\n</div>\n<div class=\"row\" ng-show=\"!vm.loading\">\n  <div class=\"col-xs-12 info-messages\">\n    <p ng-if=\"!vm.meals.complete.length > 0 && !vm.meals.pending.length > 0 && vm.items.length > 0\" class=\"bg-warning\">There are no meals currently in the system. Go <a ui-sref=\"meals\" title=\"Go to meals page\">here</a> to create some\n      <span ng-if=\"vm.items.length > 0\"> and put your ingredients to good use</span>!!</p>\n  </div>\n</div>\n\n<div class=\"row\">\n  <div ng-class=\"vm.items.length > 1 ? \'col-md-6\' : \'col-md-12\'\">\n    <button type=\"button\" class=\"btn btn-warning\" ng-if=\"!vm.editing  && vm.items.length > 0\" ng-click=\"vm.toggleEdit()\">Remove spolied or lost items</button>\n    <button type=\"button\" class=\"btn btn-info\" ng-if=\"vm.editing  && vm.items.length > 0\" ng-click=\"vm.toggleEdit()\">Finish editing</button>\n  </div>\n  <div ng-if=\"vm.items.length > 1\" class=\"col-md-6\">\n    <div class=\"pull-right sorts\">\n      <p>Sort by: </p>\n      <div class=\"btn-group  btn-group-lg\" role=\"group\" aria-label=\"sorting choices\">\n        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"vm.sortBy(\'name\')\">Name</button>\n        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"vm.sortBy(\'dateAdded\')\">Date</button>\n        <button type=\"button\" class=\"btn btn-primary\" ng-click=\"vm.sortBy(\'reservation\')\" ng-if=\"vm.meals.complete.length > 1 || vm.meals.pending.length > 1\">Reservation</button>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-md-12\">\n    <ul class=\"list-unstyled cupboardList\">\n      <li ng-repeat=\"item in vm.items track by $index\" ng-class=\"item.reservedFor ? \'reserved\' : \'\'\">\n        <div class=\"col-sm-10 description\">\n\n            <img class=\"product-thumbnail\" ng-if=\"item.ingredient.imageURL\" ng-src=\"{{item.ingredient.imageURL}}\" width=\"50px\" height=\"50px\">\n            <img class=\"product-thumbnail\" ng-if=\"!item.ingredient.imageURL\" src=\"/assets/images/item-img-placeholder.png\" width=\"50px\" height=\"50px\">\n\n          <div class=\"details-container\">\n            <h2>{{ item.ingredient.name }}</h2>\n\n            <p ng-if=\"item.reservedFor\">Reserved for meal: <span ng-class=\"item.reservedFor.isComplete ? \'meal-name completed\' : \'meal-name\'\">{{ item.reservedFor.name }}</span><span ng-if=\"item.reservedFor.startsAt\"> on <span class=\"text-info\">{{ item.reservedFor.startsAt | date : \'d MMMM y\' : GMT }}</span></span>.</p>\n\n            <p>Added: <span class=\"added-info\">{{ item.dateAdded | date : \'d MMMM y\' : GMT}}</span></p>\n            <p ng-if=\"item.reserveFor\">{{ item.reservedFor.name }} ({{ item.reservedFor._id }})</p>\n            <p ng-if=\"item.reserveFor\">unreserved</p>\n          </div>\n        </div>\n        <div class=\"col-sm-2 actions\">\n					<ul class=\"list-unstyled\">\n						<li>\n							<button ng-if=\"vm.editing\" type=\"button\" class=\"btn btn-danger btn-block\" ng-click=\"vm.remove(item)\">Remove</button>\n						</li>\n						<li>\n							<button type=\"button\" class=\"btn btn-warning btn-block\" ng-click=\"vm.unreserve(item)\" ng-if=\"item.reservedFor\">Unreserve</button>\n							<button type=\"button\" class=\"btn btn-primary btn-block\" ng-click=\"vm.showReserveModal(item)\" ng-if=\"!item.reservedFor && vm.meals.pending.length > 0\">Add to a meal</button>\n						</li>\n					</ul>\n        </div>\n      </li>\n    </ul>\n  </div>\n</div>\n");
$templateCache.put("food-calendar/food-calendar.html","<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h1>Meal Planner</h1>\n    <p class=\"ng-cloak\">You have\n      <span ng-class=\"vm.completeMeals.length > 0 ?  \'completeCount text-warning\' : \'completeCount text-info\'\">\n        {{vm.completeMeals.length}} unplaced\n        <ng-pluralize count=\"vm.completeMeals.length\" when=\"{\'1\': \'meal.\',\n                     \'other\': \'meals.\'}\">\n        </ng-pluralize>\n      </span>\n      <span ng-if=\"vm.completeMeals.length > 0\">Click on a date to place a meal.</span>\n      <span ng-if=\"vm.completeMeals.length === 0\">Go to <a href=\"#\" ui-sref=\"meals\">Build Meals</a> to create more...</span>\n\n\n    </p>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-md-4 col-md-push-4\">\n    <div class=\"form-group\">\n      <div class=\"calendarTitle\">\n        <h2>{{vm.calendarTitle}}</h2>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-md-4 col-md-pull-4\">\n    <div class=\"form-group cal-pagination-ctrls\">\n      <button class=\"btn btn-primary\" mwl-date-modifier date=\"vm.calendarDay\" decrement=\"vm.calendarView\">\n        Prev<span class=\"hidden-xs\">ious</span>\n      </button>\n\n      <button class=\"btn btn-default\" mwl-date-modifier date=\"vm.calendarDay\" set-to-today ng-cloak>\n        Now\n      </button>\n\n      <button class=\"btn btn-primary\" mwl-date-modifier date=\"vm.calendarDay\" increment=\"vm.calendarView\">\n        Next\n      </button>\n    </div>\n  </div>\n\n  <div class=\"col-md-4 cal-view-buttons-holder\">\n    <div class=\"form-group\">\n      <div class=\"btn-group cal-view-buttons\">\n        <button class=\"btn btn-primary\" ng-model=\"vm.calendarView\" btn-radio=\"\'year\'\">Year</button>\n        <button class=\"btn btn-primary\" ng-model=\"vm.calendarView\" btn-radio=\"\'month\'\">Month</button>\n        <button class=\"btn btn-primary\" ng-model=\"vm.calendarView\" btn-radio=\"\'week\'\">Week</button>\n        <button class=\"btn btn-primary\" ng-model=\"vm.calendarView\" btn-radio=\"\'day\'\">Day</button>\n      </div>\n    </div>\n  </div>\n</div>\n<div class=\"grid-wrapper\">\n  <p class=\"bg-info responsive-banner visible-xs-block\">Scroll the calendar to the left to see all the days\n    <span class=\"glyphicon glyphicon-arrow-right\"></span>\n  </p>\n\n  <mwl-calendar view=\"vm.calendarView\" current-day=\"vm.calendarDay\" events=\"vm.events\" meals=\"vm.completeMeals\" view-title=\"vm.calendarTitle\" on-event-click=\"vm.eventClicked(calendarEvent)\" on-event-times-changed=\"vm.eventTimesChanged(calendarEvent); calendarEvent.startsAt = calendarNewEventStart; calendarEvent.endsAt = calendarNewEventEnd\"\n  edit-event-html=\"\'<i class=\\\'glyphicon glyphicon-pencil\\\'></i>\'\" delete-event-html=\"\'<i class=\\\'glyphicon glyphicon-remove\\\'></i>\'\" on-edit-event-click=\"vm.eventEdited(calendarEvent)\" on-delete-event-click=\"vm.eventDeleted(calendarEvent)\" on-drill-down-click=\"vm.drillDownClick(calendarEvent)\"\n  on-timespan-click=\"vm.timespanClick(day)\" on-weekday-click=\"vm.weekdayClick(calendarEvent)\" on-add-click=\"vm.addClicked(day)\" day-view-start=\"06:00\" day-view-end=\"22:00\" day-view-split=\"30\" use-iso-week=\"true\" week-title-label=\"\" auto-open=\"true\">\n  </mwl-calendar>\n\n</div>\n");
$templateCache.put("home/home.html","<div>\n  <h1 class=\"banner\">KitchenApp</h1>\n\n\n  <img class=\"hero\" src=\"/assets/images/Food-Spread-1200x400.jpg\" alt=\"banner image\" sizes=\"(min-width: 992px) 80vw, 100vw\" srcset=\"/assets/images/Food-Spread-500x167.jpg 500w,\n			/assets/images/Food-Spread-768x256.jpg 768w,\n			/assets/images/Food-Spread-992x331.jpg 992w,\n			/assets/images/Food-Spread-1200x400.jpg 1200w\">\n\n\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <h2>Purpose</h2>\n      <p>The idea behind kitchen app is to allow you to plan meals and shopping. By building meals and then placing them into the calendar, the system will allow you to:</p>\n      <ul>\n        <li>plan meals</li>\n        <li>see what you have in your cupboards</li>\n        <li>keep a shopping list</li>\n      </ul>\n      <p>...and you can even add your own recipes and ingredients!</p>\n      <div class=\"intros\">\n        <button class=\"btn btn-primary\" ng-click=\"vm.introVideo()\">Watch the intro video</button>\n        <button class=\"btn btn-primary\" ng-click=\"vm.takeTour()\" ng-if=\"Auth.isLogged()\">Take Tour</button>\n      </div>\n      <strong ng-if=\"!Auth.isLogged()\">To begin, please register or sign in above...</strong>\n    </div>\n    <div class=\"col-md-6\">\n      <h2>How to use the app</h2>\n      <p>(Semantically running right to left on the main menu)</p>\n      <ul>\n        <li>\n          <span class=\"bg-info\">Ingredients</span> are the raw materials.</li>\n        <li>\n          <span class=\"bg-info\">Recipes</span> are the ideas for a meal.</li>\n        <li>\n          <span class=\"bg-info\">Shopping</span> handles the purchasing of those ingredients.\n          <ul>\n            <li>The\n              <span class=\"bg-info\">Shopping List</span> shows you what you need to buy to make your\n              <span class=\"bg-success\">pending meals</span>.</li>\n            <li>The\n              <span class=\"bg-info\">Budget</span> view shows you how well you\'re doing against your nominated budget.</li>\n          </ul>\n        </li>\n        <li>Your\n          <span class=\"bg-info\">Cupboard</span> shows you what you\'ve got in stock and allows you to allocate food to different meals.</li>\n        <li>\n          <span>Meals</span> signify the intent of taking ingredients to follow a recipe.\n          <ul>\n            <li>The\n              <strong class=\"bg-info\">Build Meals</strong> view allows you to\n              <span class=\"bg-success\">Add a Meal</span>:\n              <ul>\n                <li>If you have all the ingredients, then those ingredients are removed form your\n                  <span class=\"bg-success\">Cupboard</span> and the meal then appears in your\n                  <span class=\"bg-success\">Complete Meals</span> listing.</li>\n                <li>If you don\'t have the ingredients then the meal goes into the\n                  <span class=\"bg-success\">Pending Meals</span> section and the ingredients you are missing appear on the\n                  <span class=\"bg-success\">Shopping List</span>, whilst the ingredients you have are removed from your\n                  <span class=\"bg-success\">Cupboard</span>.</li>\n              </ul>\n            </li>\n            <li>The\n              <strong class=\"bg-info\">Schedule Meals</strong> view allows you to see your upcoming meals and to place\n              <span class=\"bg-success\">Complete Meals</span> onto a food calendar.</li>\n            <li>You can remove a meal from the calendar and the \'Build Meals\' view at any time and the ingredients will be released back into your cupboard.</li>\n          </ul>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("ingredients/ingredients.add.html","<div>\n	<h1>Add Ingredient</h1>\n	<editIngredientForm></editIngredientForm>\n</div>");
$templateCache.put("ingredients/ingredients.list.html","<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h1>Ingredients List</h1>\n  </div>\n</div>\n<div class=\"row\" ng-if=\"gridOptions.data.length === 0\" ng-show=\"vm.loading\">\n  <div class=\"col-xs-12\">\n    <div class=\"loader\">Loading...</div>\n  </div>\n</div>\n<div class=\"row\" ng-if=\"gridOptions.data.length === 0\" ng-show=\"!vm.loading\">\n  <div class=\"col-xs-12\">\n    <strong>There are no ingredients in memory. Please create a new one <a ui-sref=\"addIngredient\">here</a></strong>\n  </div>\n</div>\n<div class=\"controls row\" ng-if=\"gridOptions.data.length > 0\">\n  <div class=\"col-sm-12\">\n    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"vm.addToCupboard()\">Add to Cupboard</button>\n\n    <button class=\"btn btn-primary\" type=\"button\" ng-click=\"vm.addToShopping()\">Add to Shopping List</button>\n\n    <button class=\"btn btn-default\" type=\"button\" ng-click=\"vm.clear()\">Clear Selection</button>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"grid-wrapper\">\n    <p class=\"bg-info visible-xs-block responsive-banner\">Slide the table left to see all the columns  <span class=\"glyphicon glyphicon-arrow-right\"></span></p>\n    <div id=\"grid1\" ui-grid=\"gridOptions\" ui-grid-selection class=\"grid ng-ui-grid\" ng-if=\"gridOptions.data.length > 0\"></div>\n  </div>\n</div>\n");
$templateCache.put("login/login.html","<!-- <form novalidate  name=\"loginForm\" ng-submit=\"vm.login()\">\n  <formly-form model=\"vm.model\" fields=\"vm.fields\" form=\"vm.form\">\n    <button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"loginForm.$invalid\">Submit</button>\n  </formly-form>\n</form>\n\n<pre ng-if=\"vm.error\">{{ vm.error | json }}</pre> -->\n\n\n\n<form novalidate  name=\"loginForm\" ng-submit=\"vm.login()\">\n  <h1>Log In</h1>\n\n  <ul class=\"messages list-unstyled\">\n    <li ng-repeat=\"message in messages\">\n      {{message | json}}\n    </li>\n  </ul>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : loginForm.email.$invalid && !loginForm.email.$pristine }\">\n    <label for=\"email\">Email address</label>\n    <input type=\"text\" name=\"email\" id=\"email\" placeholder=\"Enter an email address\" ng-model=\"vm.user.email\" ng-required=\"true\" ng-minlength=\"2\" ng-maxlength=\"30\" class=\"form-control\" autofocus=\"true\">\n    <p ng-show=\"loginForm.email.$invalid && !loginForm.email.$pristine\" class=\"help-block\">A valid email is required.</p>\n    </div>\n  </div>\n\n\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : loginForm.password.$invalid && !loginForm.password.$pristine }\">\n    <label for=\"password\">Password</label>\n    <input type=\"password\" name=\"password\" id=\"password\" placeholder=\"Enter a password\" ng-model=\"vm.user.password\" ng-required=\"true\" ng-minlength=\"2\" ng-maxlength=\"30\" class=\"form-control\">\n    <p ng-show=\"loginForm.password.$invalid && !loginForm.password.$pristine\" class=\"help-block\">Please enter a password.</p>\n    </div>\n  </div>\n\n\n  <button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"loginForm.$invalid\">Submit</button>\n\n  </form>\n\n<pre ng-if=\"vm.error\">{{ vm.error | json }}</pre>\n");
$templateCache.put("meals/meals.html","<div class=\"row\">\n	<div class=\"col-xs-12\">\n		<h1>My Meals</h1>\n	</div>\n</div>\n	<div class=\"meals-list inventory\">\n		<div class=\"row\">\n		<div class=\"col-xs-12\">\n		<div class=\"achieved-meals panel panel-success\">\n			<div class=\"panel-heading\">\n				<h3 class=\"panel-title\">Complete Meals</h3>\n			</div>\n			<div class=\"panel-body\">\n				<ul class=\"list-unstyled\">\n					<li ng-repeat=\"meal in vm.completeMeals\" class=\"meal row\">\n						<div class=\"col-xs-2\">\n								<button class=\"btn btn-danger pull-left\" ng-click=\"vm.removeMeal(meal)\">\n									<span class=\"hidden-xs\">Remove</span>\n									<span aria-ignore=\"true\" class=\"visible-xs-inline glyphicon glyphicon-remove\"></span>\n								</a>\n						</div>\n						<div class=\"col-xs-8\"><h4>{{meal.name}}</h4></div>\n						<div class=\"col-xs-2\"></div>\n					</li>\n				</ul>\n			</div>\n		</div>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-xs-12\">\n			<div class=\"partial-meals panel panel-primary\">\n				<div class=\"panel-heading\">\n					<h3 class=\"panel-title\">Pending Meals</h3>\n				</div>\n				<div class=\"panel-body\">\n					<ul class=\"list-unstyled\">\n						<li ng-repeat=\"meal in vm.pendingMeals\" class=\"meal row\">\n							<div class=\"col-xs-2\">\n									<button class=\"btn btn-danger pull-left\" ng-click=\"vm.removeMeal(meal)\">\n										<span class=\"hidden-xs\">Remove</span>\n										<span aria-hidden=\"true\" class=\"visible-xs-inline glyphicon glyphicon-remove\"></span>\n									</button>\n							</div>\n							<div class=\"col-xs-8\">\n								<h4>{{meal.name}}</h4>\n								<p class=\"list-intro-inline\" ng-if=\"meal.hasBeenStrategised\">Missing ingredients:</p>\n								<ul class=\"inline-list ingredients-list\" ng-if=\"meal.hasBeenStrategised\">\n				         <li ng-repeat=\"item in meal.ingredients.missing\">{{item.ingredient.name}}</li>\n				       </ul>\n							 <p class=\"list-intro-inline\" ng-if=\"!meal.hasBeenStrategised\"><span class=\"reserving-text\">Reserving:</span><span class=\"meal-items-loading hloader\" ng-if=\"!meal.hasBeenStrategised\">Reserving items and populating shopping list...</span></p>\n\n						 </div>\n						 <div class=\"col-xs-2\">\n						 </div>\n						</li>\n					</ul>\n				</div>\n			</div>\n		</div>\n	</div>\n		<div class=\"add-controls\">\n			<select name=\"mealsAdder\" ng-model=\"vm.chosenRecipe\" ng-change=\"vm.createMeal()\" class=\"form-control\" ng-disabled=\"isLoading\">\n				<option value=\"\" ng-selected=\"true\">Add a meal</option>\n				<option ng-repeat=\"recipe in vm.recipes\" value=\"{{recipe._id}}\">{{recipe.name}}</option>\n			</select>\n\n			<!--<ui-select ng-model=\"vm.searchOptions\"\n             reset-search-input=\"false\"\n             title=\"Choose a Meal\">\n    <ui-select-match placeholder=\"Pick a meal...\">{{$select.selected.recipe}}</ui-select-match>\n    <ui-select-choices repeat=\"recipe in vm.recipes track by $index\">\n      <div ng-bind-html=\"recipe.name | highlight: $select.search\"></div>\n    </ui-select-choices>\n  </ui-select>-->\n		</div>\n	</div>\n</div>\n");
$templateCache.put("meals/mealsModal.html","<h1>Place a meal</h1>\n\n<ul>\n	<li ng-repeat=\"meal in completeMeals\">\n		<a href=\"\">{{meal.name}}</a>\n	</li>\n</ul>\n");
$templateCache.put("modals/cupboard-manually-reserve.html","<div class=\"modal-container\">\n		<button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"$close(null)\"><span aria-hidden=\"true\">&times;</span></button>\n	<div class=\"row\">\n		<div class=\"col-xs-12\">\n			<h1>Manually Reserve Item</h1>\n			<p>Choose a meal to reserve the item for:</p>\n		</div>\n	</div>\n	<div class=\"row\">\n		<div class=\"col-xs-12\">\n			<ul class=\"list-unstyled\">\n				<li ng-repeat=\"meal in pendingMeals\">\n					<button href=\"#\" class=\"btn btn-block btn-info\" ng-click=\"reserve(this.item, meal); $close(null)\">{{::meal.name}}</button>\n				</li>\n			</ul>\n		</div>\n	</div>\n</div>\n");
$templateCache.put("modals/food-calendar-modal.html","<div class=\"modal-container\">\n	<button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"$close(null)\"><span aria-hidden=\"true\">&times;</span></button>\n\n			<h1>Place a meal</h1>\n\n		<ul class=\"list-unstyled modal-meals-list\">\n			<li ng-repeat=\"meal in completeMeals\">\n				<button class=\"btn btn-block btn-info\" ng-click=\"placeMeal(meal, selectedDate)\">{{meal.name}}</button>\n			</li>\n		</ul>\n\n			<div class=\"actions\">\n				<button type=\"button\" class=\"btn btn-primary pull-right\" aria-label=\"Close\" ng-click=\"$close(null)\">Done</button>\n			</div>\n\n</div>\n");
$templateCache.put("modals/intro-modal.html","<div class=\"modal-container\">\n	<button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"$close(null)\"><span aria-hidden=\"true\">&times;</span></button>\n\n\n      <div class=\"iframe-wrapper\">\n        <h1>Place a meal</h1>\n<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/8Y3TU6T0n34\" frameborder=\"0\" allowfullscreen></iframe>\n<div class=\"actions\">\n	<button type=\"button\" class=\"btn btn-primary pull-right\" aria-label=\"Close\" ng-click=\"$close(null)\">Done</button>\n</div>\n</div>\n\n\n</div>\n");
$templateCache.put("profile/profile.html","<div>\n  <h1>Profile View</h1>\n\n	<div class=\"form-group\">\n		<img gravatar-src-once=\"vm.user.email\" gravatar-size=\"100\" height=\"100\" width=\"100\" ng-cloak>\n		<p>To edit your avatar go to <a href=\"//www.gravatar.com\" target=\"_self\">gravatar.com</a></p>\n	</div>\n\n	<dl class=\"personal-details\">\n		<dt>Email</dt>\n		<dd>{{vm.user.email}}</dd>\n		<dt>Budget</dt>\n		<dd>{{vm.user.budget | currency }} per week</dd>\n	</dl>\n\n</div>\n");
$templateCache.put("recipes/recipes.add.html","<div>\n	<add-recipe-form></add-recipe-form>\n</div>\n");
$templateCache.put("recipes/recipes.list.html","<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <h1>Recipes List</h1>\n  </div>\n</div>\n<div class=\"row\" ng-if=\"gridOptions.data.length === 0\" ng-show=\"vm.loading\">\n  <div class=\"col-xs-12\">\n    <div class=\"loader\">Loading...</div>\n  </div>\n</div>\n<div class=\"row\" ng-if=\"gridOptions.data.length === 0\" ng-show=\"!vm.loading\">\n  <div class=\"col-xs-12\">\n    <strong>There are no recipes in memory. Please create a new one <a ui-sref=\"addRecipe\">here</a></strong>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-xs-12\">\n    <div class=\"grid-wrapper\">\n      <p class=\"bg-info responsive-banner visible-xs-block\">Slide the table left to see all the columns  <span class=\"glyphicon glyphicon-arrow-right\"></span></p>\n      <div ng-if=\"gridOptions.data.length > 0\" id=\"grid1\" ui-grid=\"gridOptions\" class=\"grid ng-ui-grid\"></div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("shop/budget.html","<div class=\"row\">\n	<div class=\"col-xs-12\">\n		<h1>Budget</h1>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-xs-12\">\n		<p>Graph of weekly shopping expenditure:</p>\n    <nvd3 options=\'options\' data=\'data\' api=\"api\"></nvd3>\n	</div>\n</div>\n");
$templateCache.put("shop/shop.html","<div class=\"row\">\n	<div class=\"col-md-12\">\n		<h1>Shopping List</h1>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-md-12\">\n		<p ng-if=\"!vm.items.length\">You have no items on your list. Add <a ui-sref=\"meals\">meals</a> to generate a shopping list. (You can also add items from the <a ui-sref=\"ingredients\">ingredients</a> view)</p>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-md-12\">\n		<div ng-if=\"vm.items.length > 1\" class=\"col-md-6 col-md-offset-6\">\n			<div class=\"pull-right sorts\" ng-if=\"vm.meals.complete.length > 0 || vm.meals.pending.length > 0\">\n				<p>Sort by: </p>\n				<div class=\"btn-group  btn-group-lg\" role=\"group\" aria-label=\"sorting choices\">\n					<button type=\"button\" class=\"btn btn-primary\" ng-click=\"vm.sortBy(\'name\')\">Name</button>\n					<button type=\"button\" class=\"btn btn-primary\" ng-if=\"vm.meals.length > 1\" autofocus=\"\"ng-click=\"vm.sortBy(\'reservation\')\">Reservation</button>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-md-12\">\n		<ul class=\"list-unstyled shoppingList\">\n  		<li ng-repeat=\"item in vm.items track by $index\">\n  			<div class=\"col-md-10 description\">\n						<img class=\"product-thumbnail\" ng-if=\"item.ingredient.imageURL\" ng-src=\"{{item.ingredient.imageURL}}\" width=\"50px\" height=\"50px\">\n						<img class=\"product-thumbnail\" ng-if=\"!item.ingredient.imageURL\" src=\"/assets/images/item-img-placeholder.png\" width=\"50px\" height=\"50px\">\n					<div class=\"details-container\">\n						<h2>{{item.ingredient.name}}</h2>\n						<p ng-if=\"item.reservedFor\" class=\"reservedFor\">(To make <span class=\"text-info\">{{item.reservedFor.name}}</span>)</p>\n					</div>\n				</div>\n  			<div class=\"col-md-2 actions\">\n  				<button type=\"button\" class=\"btn btn-primary\" ng-click=\"vm.buy(item)\">Buy</button>\n					<button type=\"button\" class=\"btn btn-danger\" ng-if=\"!item.reservedFor\" ng-click=\"vm.remove(item)\">Remove</button>\n  			</div>\n  		</li>\n  	</ul>\n	</div>\n</div>\n");
$templateCache.put("signup/signup.html","<!-- <form novalidate  name=\"signupForm\" ng-submit=\"vm.signup()\">\n  <formly-form model=\"vm.model\" fields=\"vm.fields\" form=\"vm.form\">\n    <button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"signupForm.$invalid\">Submit</button>\n  </formly-form>\n</form>\n\n<pre ng-if=\"vm.error\">{{ vm.error | json }}</pre> -->\n\n\n\n<form novalidate  name=\"signupForm\" ng-submit=\"vm.signup()\">\n  <h1>Sign Up</h1>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : signupForm.email.$invalid && !signupForm.email.$pristine }\">\n    <label for=\"email\">Email address</label>\n    <input type=\"text\" name=\"email\" id=\"email\" placeholder=\"Enter an email address\" ng-model=\"vm.user.email\" ng-required=\"true\" ng-minlength=\"2\" ng-maxlength=\"30\" class=\"form-control\">\n    <p ng-show=\"signupForm.email.$invalid && !signupForm.email.$pristine\" class=\"help-block\">A valid email is required.</p>\n    </div>\n  </div>\n\n\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : signupForm.password.$invalid && !signupForm.password.$pristine }\">\n    <label for=\"password\">Password</label>\n    <input type=\"password\" name=\"password\" id=\"password\" placeholder=\"Enter a password\" ng-model=\"vm.user.password\" ng-required=\"true\" ng-minlength=\"2\" ng-maxlength=\"30\" class=\"form-control\">\n    <p ng-show=\"signupForm.password.$invalid && !signupForm.password.$pristine\" class=\"help-block\">A valid password is required.</p>\n    </div>\n  </div>\n\n\n\n\n  <hr>\n  <div class=\"form-group\">\n    <label for=\"userBudget\">Budget (£ per week):</label>\n    <input id=\"userBudget\" type=\"text\"\n         ng-model=\"vm.user.budget\"\n         placeholder=\"&pound;?\">\n  </div>\n\n  <button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"signupForm.$invalid\">Submit</button>\n\n  </form>\n\n<pre ng-if=\"vm.error\">{{ vm.error | json }}</pre>\n");
$templateCache.put("ingredient-form/ingredient-form.html","<form ng-submit=\"vm.addIngredient(this)\" novalidate name=\"ingredientForm\">\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : ingredientForm.name.$invalid && !ingredientForm.name.$pristine }\">\n  	<label for=\"ingredient_name\">Name</label>\n  	<input type=\"text\" name=\"name\" id=\"ingredient_name\" placeholder=\"Give it a name\" ng-model=\"vm.newIngredient.name\" ng-required=\"true\" ng-minlength=\"2\" ng-maxlength=\"30\" ng-trim=\"true\">\n    <ul ng-if=\"ingredientForm.name.$invalid && !ingredientForm.name.$pristine\" ng-messages=\"ingredientForm.name.$error\" class=\"help-block list-unstyled\">\n      <li ng-message=\"required\">A name is required.</li>\n      <li ng-message=\"minlength\">The name must be longer than 2 characters.</li>\n      <li ng-message=\"maxlength\">The name must be less than 30 characters.</li>\n    </ul>\n    </div>\n  </div>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : ingredientForm.description.$invalid && !ingredientForm.description.$pristine }\">\n  	<label for=\"ingredient_description\">Description</label>\n  	<textarea name=\"description\" id=\"ingredient_description\" placeholder=\"Add a description\" ng-model=\"vm.newIngredient.description\" ng-required=\"true\" ng-minlength=\"2\" ng-maxlength=\"100\" ng-trim=\"true\"></textarea>\n    <ul ng-if=\"ingredientForm.name.$invalid && !ingredientForm.name.$pristine\" ng-messages=\"ingredientForm.description.$error\" class=\"help-block list-unstyled\">\n      <li ng-message=\"required\">A description is required.</li>\n      <li ng-message=\"minlength\">The name must be longer than 2 characters.</li>\n      <li ng-message=\"maxlength\">The name must be less than 100 characters.</li>\n    </ul>\n  </div>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : ingredientForm.mg_url.$invalid && !ingredientForm.mg_url.$pristine }\">\n    <label for=\"ingredient_img_url\">Image URL</label>\n    <input type=\"url\" id=\"ingredient_img_url\" name=\"img_url\" placeholder=\"Provide a link to an image of the ingredient\" ng-model=\"vm.newIngredient.imageURL\" ng-trim=\"true\">\n    <p ng-show=\"ingredientForm.img_url.$invalid && !ingredientForm.img_url.$pristine\" class=\"help-block\">Incorrect URL format.</p>\n    <ul ng-if=\"ingredientForm.img_url.$invalid && !ingredientForm.img_url.$pristine\" ng-messages=\"ingredientForm.img_url.$error\" class=\"help-block list-unstyled\">\n      <li ng-message=\"invalid\">Image URL is not of the right format.</li>\n    </ul>\n  </div>\n\n  <div class=\"form-group horizontal-group\" ng-class=\"{ \'has-error\' : ingredientForm.price.$invalid && !ingredientForm.price.$pristine }\">\n    <fieldset>\n      <legend>Price: <span class=\"text-info\">&pound;{{vm.newIngredient.price.toFixed(2)}}</span></legend>\n\n    <div class=\"horizontal-input-group\">\n      <label for=\"ingredient_price_pounds\">&pound;</span> </label>\n      <input type=\"number\" name=\"pounds\" id=\"ingredient_price_pounds\" placeholder=\"How much is it? &pound;&apos;s\" ng-model=\"vm.newIngredient.pounds\" ng-required=\"true\" ng-maxlength=\"5\" ng-keyup=\"vm.handlePrice(event)\" numbersOnly>\n      <input type=\"number\" name=\"pence\" id=\"ingredient_price_pence\" placeholder=\"pence\" ng-model=\"vm.newIngredient.pence\" ng-required=\"true\" maxlength=\"2\" ng-maxlength=\"2\" ng-keyup=\"vm.handlePrice(event)\" numbersOnly>\n      <label for=\"ingredient_price_pence\"><abbr title=\"pence\">p</abbr></label>\n    </div>\n    <ul ng-if=\"ingredientForm.price.$invalid && !ingredientForm.price.$pristine\" ng-messages=\"ingredientForm.price.$error\" class=\"help-block list-unstyled\">\n      <li ng-message=\"required\">A price is required.</li>\n    </ul>\n  </div>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : ingredientForm.quantity.$invalid && !ingredientForm.quantity.$pristine }\">\n    <label for=\"ingredient_quantity\">Quantity (in servings)</label>\n    <input type=\"text\" name=\"quantity\" id=\"ingredient_quantity\" placeholder=\"What quantity does it come in?\" ng-model=\"vm.newIngredient.quantity\" ng-required=\"true\"  maxlength=\"10\" ng-trim=\"true\">\n    <ul ng-if=\"ingredientForm.quantity.$invalid && !ingredientForm.quantity.$pristine\" ng-messages=\"ingredientForm.quantity.$error\" class=\"help-block list-unstyled\">\n      <li ng-message=\"required\">A quantity is required.</li>\n      <li ng-message=\"maxlength\">Quantity value must be less than 10 characters.</li>\n    </ul>\n  </div>\n\n  <div class=\"form-group\">\n    <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"ingredientForm.$invalid\">Add</button>\n  </div>\n\n</form>\n");
$templateCache.put("nav-bar/nav-bar.html","<nav  class=\"navbar navbar-default navbar-fixed-top\">\n  <div class=\"loading-warning\" ng-show=\"isLoading\">\n        <p>Computing...</p>\n  </div>\n  </div>\n<div class=\"container-fluid\" ng-if=\"!isLoading\">\n    <!-- Brand and toggle get grouped for better mobile display -->\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\"  ng-hide=\"isLoading\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"\" ui-sref=\"home\"><span class=\"logo\">K</span><span class=\"full-title\">itchenApp</span></a>\n    </div>\n\n    <!-- Collect the nav links, forms, and other content for toggling -->\n    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n      <ul class=\"nav navbar-nav\" ng-hide=\"isLoading\">\n        <li ng-show=\"Auth.isLogged()\">\n          <a ui-sref=\"food-calendar\" href=\"#\">Schedule Meals</a>\n        </li>\n        <li ng-show=\"Auth.isLogged()\">\n          <a ui-sref=\"meals\" href=\"#\">Build Meals</a>\n        </li>\n        <li ng-show=\"Auth.isLogged()\">\n          <a ui-sref=\"cupboard\" href=\"#\">My Cupboard</a>\n        </li>\n        <li class=\"dropdown\" ng-show=\"Auth.isLogged()\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\" target=\"_self\">Shopping<span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\" role=\"menu\">\n            <li>\n              <a ui-sref=\"shop\" href=\"#\">Shopping List</a>\n            </li>\n            <li>\n              <a ui-sref=\"budget\" href=\"#\">Budget</a>\n            </li>\n          </ul>\n        </li>\n        <li class=\"dropdown\" ng-show=\"Auth.isLogged()\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\" target=\"_self\">Recipes<span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\" role=\"menu\">\n            <li>\n              <a href=\"#\" ui-sref=\"recipes\">List Recipes</a>\n            </li>\n            <li ng-show=\"Auth.isLogged()\">\n              <a href=\"#\" ui-sref=\"addRecipe\">Add Recipe</a>\n            </li>\n          </ul>\n        </li>\n\n        <li class=\"dropdown\" ng-show=\"Auth.isLogged()\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\" target=\"_self\">Ingredients<span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\" role=\"menu\">\n            <li>\n              <a href=\"#\" ui-sref=\"ingredients\">List Ingredients</a>\n            </li>\n            <li ng-show=\"Auth.isLogged()\">\n              <a href=\"#\" ui-sref=\"addIngredient\">Add Ingredient</a>\n            </li>\n          </ul>\n        </li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\" id=\"auth-menu\"  ng-if=\"!isLoading || !isLoggingOut\">\n        <li ng-hide=\"Auth.isLogged()\">\n          <a href=\"#\" ui-sref=\"signup\">signup</a>\n        </li>\n        <li ng-hide=\"Auth.isLogged()\">\n          <a href=\"#\" ui-sref=\"login\">login</a>\n        </li>\n        <li ng-show=\"Auth.isLogged()\">\n          <a href=\"#\" ui-sref=\"profile\">Profile</a>\n        </li>\n        <li ng-show=\"Auth.isLogged()\">\n          <a href=\"#\" ng-click=\"Auth.logout()\">logout</a>\n        </li>\n      </ul>\n    </div><!-- /.navbar-collapse -->\n  </div><!-- /.container-fluid  -->\n</nav>\n");
$templateCache.put("recipe-form/recipe-form.html","<form ng-submit=\"vm.saveRecipe(this)\" novalidate  name=\"recipeForm\">\n\n<h1>Add a new recipe</h1>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : recipeForm.name.$invalid && !recipeForm.name.$pristine }\">\n    <label for=\"recipe_name\">Name</label>\n    <input type=\"text\" name=\"name\" id=\"recipe_name\" placeholder=\"Give it a name\" ng-model=\"vm.newRecipe.name\" ng-required=\"true\" ng-minlength=\"2\" ng-maxlength=\"30\">\n    <p ng-show=\"recipeForm.name.$invalid && !recipeForm.name.$pristine\" class=\"help-block\">A name is required for the recipe.</p>\n    </div>\n  </div>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : recipeForm.description.$invalid && !recipeForm.description.$pristine }\">\n    <label for=\"recipe_description\">Description</label>\n    <textarea name=\"description\" id=\"recipe_description\" placeholder=\"Add a description\" ng-model=\"vm.newRecipe.description\" ng-required=\"true\" ng-minlength=\"2\" ng-maxlength=\"50\"></textarea>\n    <p ng-show=\"recipeForm.description.$invalid && !recipeForm.description.$pristine\" class=\"help-block\">A description is required.</p>\n  </div>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : recipeForm.mg_url.$invalid && !recipeForm.mg_url.$pristine }\">\n    <label for=\"recipe_img_url\">Image URL</label>\n    <input type=\"url\" id=\"recipe_img_url\" name=\"img_url\" placeholder=\"Provide a link to an image of the recipe\" ng-model=\"vm.newRecipe.imageURL\">\n    <p ng-show=\"recipeForm.mg_url.$invalid && !recipeForm.mg_url.$pristine\" class=\"help-block\">Incorrect URL format.</p>\n  </div>\n\n  <div class=\"form-group\" ng-class=\"{ \'has-error\' : recipeForm.ingredients.$invalid && !recipeForm.recipes.$pristine }\">\n    <label for=\"ingredientSelect\" class=\"bg-info\">Select ingredients (Hold down ctrl or cmd to select multiple ingredients)</label>\n    <select multiple id=\"ingredientSelect\" name=\"ingredients\" ng-model=\"vm.newRecipe.ingredients\">\n      <option value=\"{{ing._id}}\" ng-repeat=\"ing in vm.ingredients\">{{ing.name}}</option>\n    </select>\n    <p ng-show=\"recipeForm.ingredients.$invalid && !recipeForm.ingredients.$pristine\" class=\"help-block\">You need to add some ingredients</p>\n  </div>\n\n  <div class=\"form-group\">\n    <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"recipeForm.$invalid\">Add</button>\n  </div>\n\n</form>\n");}]);