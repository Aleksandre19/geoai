export function topicTitleActions(e) {
    const target = e.target; // Get current element
    const classNames = target.className.split(" "); // Grab current element's class attributes
    const currentElm = classNames[classNames.length - 1]; // Current element's class name
    // If action is deletion
    if(currentElm == 'geoai-trash-icon'){
        // Add alert text to deletion.
        const actBtn = target.parentNode.nextElementSibling;
        actBtn.querySelector('.confirm-msg').textContent = 'წავშალო?';

        // Hide action buttons and open confirmation dialog box
        target.parentNode.classList.add('hide-element'); // class='topic-title-act-btn'
        const nextSibling = target.parentNode.nextElementSibling; // class='act-btn-confirm'
        nextSibling.classList.add('display-act-btn-confirm'); // Display confirmation container

    // If action is closing current action
    }else if (currentElm == 'geoai-x-icon'){
        target.parentNode.classList.remove('display-act-btn-confirm'); // class='act-btn-confirm'
        const prevSibling = target.parentNode.previousElementSibling; // class='topic-title-act-btn'
        prevSibling.classList.remove('hide-element');

        // If action is editions of topic title
    } else if (currentElm == 'geoai-edit-icon') {
        // Topic title 'a' element
        const topicTitle = target.parentNode.parentNode.previousElementSibling;    
        const nextSibling = target.parentNode.nextElementSibling; // class='act-btn-confirm'
        // Grab message element
        const actMsg = nextSibling.querySelector(`p.confirm-msg`); // class='confirm-msg'
        // Display action buttons
        nextSibling.classList.add('display-act-btn-confirm');
        // Add title content to action's message
        actMsg.textContent = topicTitle.textContent.trim();
        // Make editable message element
        actMsg.contentEditable = true; // class='confirm-msg'
        // Auto focus message element
        actMsg.focus(); // class='confirm-msg'
    }
}